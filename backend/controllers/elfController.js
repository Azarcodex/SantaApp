import Elf from '../models/Elf.js';

// GET /api/elves
export const getElves = async (req, res) => {
    try {
        const { role, status, location, fatigueAbove, overloadedOnly } = req.query;
        let query = {};

        if (role) query.role = role;
        if (status) query.status = status;
        if (location) query.location = location;
        if (fatigueAbove) query.fatigueLevel = { $gt: parseInt(fatigueAbove) };
        if (overloadedOnly === 'true') query.status = 'Overloaded';

        const elves = await Elf.find(query).sort({ updatedAt: -1 });
        res.json(elves);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/elves/:id
export const getElfById = async (req, res) => {
    try {
        const elf = await Elf.findById(req.params.id);
        if (!elf) return res.status(404).json({ message: 'Elf not found' });
        res.json(elf);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PATCH /api/elves/:id/status
export const updateElfStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const elf = await Elf.findById(req.params.id);
        if (!elf) return res.status(404).json({ message: 'Elf not found' });

        // Business Logic
        if (status === 'Active') {
            // "Reset Status" or "Return to Duty" manually fixes stats to prevent immediate re-overload
            if (elf.fatigueLevel > 80) elf.fatigueLevel = 79;
            if (elf.tasksAssigned > 10) elf.tasksAssigned = 10;
        }

        elf.status = status;

        if (status === 'Off-Duty') {
            elf.tasksAssigned = 0;
            elf.fatigueLevel = Math.max(0, elf.fatigueLevel - 40); // Better relief on force rest
        }

        await elf.save();
        res.json(elf);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PATCH /api/elves/:id/reassign-tasks
export const reassignTasks = async (req, res) => {
    try {
        const amount = Number(req.body.amount) || 1;
        const elf = await Elf.findById(req.params.id);
        if (!elf) return res.status(404).json({ message: 'Elf not found' });

        if (elf.tasksAssigned <= 0) {
            return res.status(400).json({ message: 'No tasks to reassign from this elf' });
        }

        const reduceBy = Math.min(elf.tasksAssigned, amount);
        elf.tasksAssigned -= reduceBy;

        // Auto-fix status if load lightens
        if (elf.tasksAssigned < 5 && elf.fatigueLevel < 70 && elf.status === 'Overloaded') {
            elf.status = 'Active';
        }

        await elf.save();
        res.json({ message: 'Tasks unassigned', elf });
    } catch (err) {
        console.error(`ERROR: reassignTasks:`, err);
        res.status(400).json({ error: err.message });
    }
};

// POST /api/elves/:id/assign-task
export const assignTask = async (req, res) => {
    try {
        const amount = Number(req.body.amount) || 1;
        const elf = await Elf.findById(req.params.id);
        if (!elf) return res.status(404).json({ message: 'Elf not found' });

        if (elf.status === 'Off-Duty') {
            return res.status(400).json({ message: 'Cannot assign tasks to an Off-Duty elf.' });
        }

        elf.tasksAssigned += amount;
        elf.fatigueLevel = Math.min(100, elf.fatigueLevel + (amount * 2));

        if (elf.tasksAssigned > 10 || elf.fatigueLevel > 80) {
            elf.status = 'Overloaded';
        } else if (elf.status === 'Idle') {
            elf.status = 'Active';
        }

        await elf.save();
        res.json({ message: 'Tasks assigned', elf });
    } catch (err) {
        console.error(`ERROR: assignTask:`, err);
        res.status(400).json({ error: err.message });
    }
};

// POST /api/elves/auto-balance
export const autoBalance = async (req, res) => {
    try {
        // Find overloaded elves
        const overloadedElves = await Elf.find({ status: 'Overloaded' });

        let movedTasks = 0;
        let logs = [];

        for (const elf of overloadedElves) {
            const surplus = elf.tasksAssigned - 5; // Keep them at a manageable 5
            if (surplus > 0) {
                // Find a fresh elf
                const freshElf = await Elf.findOne({
                    status: { $in: ['Idle', 'Active'] },
                    fatigueLevel: { $lt: 50 },
                    tasksAssigned: { $lt: 5 },
                    _id: { $ne: elf._id }
                });

                if (freshElf) {
                    elf.tasksAssigned -= surplus;
                    freshElf.tasksAssigned += surplus;
                    freshElf.fatigueLevel += (surplus * 2); // Work costs energy

                    await elf.save();
                    await freshElf.save();

                    movedTasks += surplus;
                    logs.push(`Moved ${surplus} tasks from ${elf.name} to ${freshElf.name}`);
                }
            }
        }

        res.json({ message: 'Auto-balance complete', movedTasks, logs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/elves (To seed or add)
export const createElf = async (req, res) => {
    try {
        const elf = new Elf(req.body);
        await elf.save();
        res.status(201).json(elf);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
