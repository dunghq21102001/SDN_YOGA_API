const express = require('express')
const cors = require("cors")
const classModel = require('../models/Class')
const userModel = require('../models/User')
const requestModel = require('../models/Request')
const classRouter = express.Router()
classRouter.use(cors())
const { ObjectId } = require('mongodb')

const commonFunction = require('../commonFunction')
classRouter.get('/', cors(), async (req, res, next) => {
    try {
        const listClasses = await classModel.find({}).populate('classcategories').populate('userIds').populate('ptIds')
        res.send(listClasses)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

classRouter.get('/can-register', cors(), async (req, res) => {
    const currentDate = new Date().toISOString().split('T')[0];

    try {
        const classes = await classModel.find({
            endDate: { $gt: currentDate }
        })
            .populate('classcategories')
            .populate('userIds')
            .populate('ptIds')
            .exec();

        res.json(classes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

classRouter.get('/search', cors(), async (req, res) => {
    const searchQuery = req.query.name
    console.log(searchQuery)
    try {
        const classes = await classModel.find({ name: { $regex: searchQuery, $options: 'i' } })
        res.json(classes)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

classRouter.get('/classes-by-category', async (req, res) => {
    const categoryName = req.query.categoryName;
    const currentDate = new Date().toISOString().split('T')[0];

    try {
        const classes = await classModel.find({
            'classcategories.name': categoryName,
            endDate: { $gt: currentDate }
        }).exec();

        res.json(classes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

classRouter.get('/user/:userId/classes', cors(), async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        // Lấy danh sách lớp đã tham gia và đã dạy của người dùng
        const joinedClasses = await classModel.find({ userIds: userId }).populate('userIds').populate('ptIds');
        const taughtClasses = await classModel.find({ ptIds: userId }).populate('userIds').populate('ptIds');

        res.status(200).json({ joinedClasses, taughtClasses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
});

classRouter.get('/top-6-classes', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const topClasses = await classModel
            .find({ endDate: { $gt: currentDate } })
            .limit(6)
            .sort({ createdAt: -1 });

        res.json(topClasses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

classRouter.get('/requests', cors(), async (req, res) => {
    try {
        const requests = await requestModel.find().populate('user class');
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

classRouter.get('/:id', cors(), async (req, res, next) => {
    try {
        const id = new ObjectId(req.params.id)
        const aClass = await classModel.findById(id).populate('classcategories').populate('userIds').populate('ptIds')
        res.send(aClass)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})



classRouter.post('/requests', cors(), async (req, res) => {
    try {
        const userId = req.body.userId;
        const classId = req.body.classId;

        const existingRequest = await requestModel.findOne({ user: userId, class: classId });

        if (existingRequest) {
            return res.status(400).json({ message: 'You have already submitted a request for this class.' });
        }

        const requestCount = await requestModel.countDocuments({ user: userId });

        if (requestCount >= 3) {
            return res.status(400).json({ message: 'You have reached the maximum number of requests.' });
        }

        const classData = await classModel.findOne({ _id: classId, $or: [{ userIds: userId }, { ptIds: userId }] });

        if (classData) {
            return res.status(400).json({ message: 'You have taken this class before.' });
        }

        await requestModel.create({
            user: userId,
            class: classId,
            requestDetails: req.body.requestDetails
        });

        res.status(201).json({ message: 'Yêu cầu của bạn đã được gửi thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
});




classRouter.delete('/requests/:id', cors(), async (req, res) => {
    try {
        const requestId = req.params.id;
        const deletedRequest = await requestModel.findByIdAndDelete(requestId);
        if (!deletedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(deletedRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
classRouter.post('/', cors(), async (req, res) => {
    try {
        classModel.create({
            name: req.body.name,
            cost: req.body.cost,
            numberSession: req.body.numberSession,
            description: req.body.description,
            note: req.body.note,
            createdDate: new Date().toLocaleString(),
            startedDate: req.body.startedDate,
            endDate: req.body.endDate,
            userIds: req.body.userIds,
            ptIds: req.body.ptIds,
            classcategories: req.body.classcategories
        })

        res.send('ok')
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

classRouter.post('/:classId/pt/:userId', async (req, res) => {
    try {
        const classId = req.params.classId;
        const userId = req.params.userId;

        const existingClass = await classModel.findById(classId);
        if (!existingClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        existingClass.ptIds.push(userId);
        await existingClass.save();

        res.json({ message: 'User added as PT to class successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

classRouter.post('/:classId/user/:userId', async (req, res) => {
    try {
        const classId = req.params.classId;
        const userId = req.params.userId;

        const existingClass = await classModel.findById(classId);
        if (!existingClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingUserIndex = existingClass.userIds.indexOf(userId);
        if (existingUserIndex > -1) {
            return res.status(400).json({ message: 'User already exists in the class' });
        }

        existingClass.userIds.push(userId);
        await existingClass.save();

        res.json({ message: 'User added to class successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

classRouter.delete('/classes/:classId/pt/:userId', async (req, res) => {
    try {
        const classId = req.params.classId;
        const userId = req.params.userId;

        const existingClass = await classModel.findById(classId);
        if (!existingClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingUserIndex = existingClass.ptIds.indexOf(userId);
        if (existingUserIndex === -1) {
            return res.status(400).json({ message: 'User is not a PT for this class' });
        }

        existingClass.ptIds.splice(existingUserIndex, 1);
        await existingClass.save();

        res.json({ message: 'PT removed from class successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

classRouter.delete('/classes/:classId/user/:userId', async (req, res) => {
    try {
        const classId = req.params.classId;
        const userId = req.params.userId;

        const existingClass = await classModel.findById(classId);
        if (!existingClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingUserIndex = existingClass.userIds.indexOf(userId);
        if (existingUserIndex === -1) {
            return res.status(400).json({ message: 'User is not enrolled in this class' });
        }

        existingClass.userIds.splice(existingUserIndex, 1);
        await existingClass.save();
        res.json({ message: 'User removed from class successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

classRouter.put('/updateAClass/:id', async (req, res) => {
    const classId = req.params.id
    const updatedClassData = req.body

    try {
        const result = await classModel.findOneAndUpdate(
            { _id: classId },
            updatedClassData,
            { new: true }
        )
        if (result) {
            res.status(200).json({ message: 'Class updated successfully', updatedClass: result })
        } else {
            res.status(404).json({ error: 'Class not found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating class' })
    }
})

classRouter.put('/:id', (req, res, next) => {
    var id = req.params.id
    var newptId = req.body.ptIds
    console.log(newptId)
    let arr = []
    arr.push(newptId)
    classModel.findByIdAndUpdate(id, {
        ptIds: arr
    })
        .then(data => {
            res.json("Update successfully")
        })
        .catch(err => {
            res.status(500).json("Cannot update!!!")
        })
})

classRouter.put('/choosen/:id', (req, res, next) => {
    var id = req.params.id
    var newuserIds = req.body.userIds
    let arr = []
    arr.push(newuserIds)
    classModel.findByIdAndUpdate(id, {
        userIds: arr
    })
        .then(data => {
            res.json("Update successfully")
        })
        .catch(err => {
            res.status(500).json("Cannot update!!!")
        })
})

classRouter.get('/sort/:order', cors(), async (req, res) => {
    const sortField = 'name'
    const sortOrder = req.params.order === 'desc' ? -1 : 1

    try {
        const classes = await classModel.find().sort({ [sortField]: sortOrder })
        res.json(classes)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

classRouter.delete('/:id', async (req, res) => {
    const classId = req.params.id

    try {
        const result = await classModel.findOneAndDelete({ _id: classId })
        if (result) {
            res.status(200).json({ message: 'Class deleted successfully' })
        } else {
            res.status(404).json({ error: 'Class not found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting class' })
    }
})




module.exports = classRouter