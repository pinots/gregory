import admin from '../config/firebase-config'

class Middleware {
	async decodeToken(req, res, next) {
		const token:string  = req.headers.authorization.split(' ')[1];
		try {
			const decodeValue = await admin.auth().verifyIdToken(token);
			if (decodeValue) {
				req.user = decodeValue;
				return next();
			}
			return res.json({ message: 'Unauthorize' });
		} catch (e) {
            console.log(e.message)
			return res.json({ message: 'Internal Error' });
		}
	}
}

export default new Middleware()