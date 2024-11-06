import express from 'express';
import managementModel from '../models/managementModel.js';
import requestModel from '../models/requestModel.js';
import connectDB from '../config/mongodb.js';


const adminRouter = express.Router();

adminRouter.get('/requests', async (req, res) => {
	try {
		let requests = await requestModel.find({});
		return res.status(200).send(requests);		
	} catch (err) {
		if (err?.code === 11000) {
			return res.status(409).send({ message: 'Email Already Exists' })
		}
		console.log("error while fetching the user request", err);
		return res.status(500).send({ message: err?.message || err });
	}
})

adminRouter.get('/approveRequest/:id', async (req, res) => {
	try {
		let requestId = req?.params?.id;
		await connectDB();
		let request = await requestModel.findByIdAndUpdate(requestId, {
			$set: {
				status: 'approved',
			}
		}, { new: true });
		let users = await managementModel.findOne({
            email : request?.email,
        })
        if(users){
            return res.status(200).send({message: 'User Already Exists'});
        }
		await managementModel.create({
			email: request?.email,
		});

		return res.status(200).send('Approved');

	} catch (err) {
		console.log("error while approving the user request", err);
		return res.status(500).send({ message: err?.message || err });
	}
})


adminRouter.get('/rejectRequest/:id', async (req, res) => {
	try {
		let requestId = req?.params?.id;
		await connectDB();
		await requestModel.findByIdAndUpdate(requestId, {
			$set: {
				status: 'rejected',
			}
		});

		return res.status(200).send('Approved');

	} catch (error) {
		console.log("error while rejecting the user request", err);
		return res.status(500).send({ message: err?.message || err });
	}
})


adminRouter.post('/user', async (req, res) => {
	try {
		await connectDB();
		const user = new managementModel(req?.body);
		await user.save();
		return res.status(201).send(user);
	} catch (err) {
		if (err?.code === 11000) {
			return res.status(409).send({ message: 'Email Already Exists' })
		}
		console.log("error while creating new user", err);
		return res.status(500).send({ message: err?.message || err });
	}
})

adminRouter.delete('/user/:id', async (req, res) => {
	try {
		await connectDB();
		let userId = req?.params?.id;
		await managementModel.findByIdAndDelete(userId);
		return res.status(200).send('User deleted successfully');
	} catch (err) {
		console.log(`error while deleting the user,\n${err.message}`);
		return res.status(500).send(err);
	}
})

adminRouter.get('/users', async (req, res) => {
	try {
		await connectDB();
		const users = await managementModel.find();
		return res.status(200).send(users);
	} catch (err) {
		console.log("error while retrieving users ", err);
		return res.status(500).send(err);
	}
})


adminRouter.put('/user/:id', async (req, res) => {
	try {
		await connectDB();
		let userId = req.params.id;
		let updatedData = req.body;
		const updatedUserInfo = await managementModel.findByIdAndUpdate(
			userId,
			{
				$set: updatedData
			},
			{ new: true }
		);
		return res.status(200).send(updatedUserInfo);
	} catch (err) {
		console.log("error while editing user", err);
		res.status(500).send(err);
	}
})

export default adminRouter;