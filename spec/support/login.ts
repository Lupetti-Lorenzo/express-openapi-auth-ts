import { SuperTest, Test, Response } from 'supertest';

import User, { UserRoles } from '@src/models/User';
import UserRepo from '@src/repos/UserRepo';
import PwdUtil from '@src/util/PwdUtil';

import Paths from './Paths';

// **** Variables **** //

const LoginCreds = {
	email: 'jsmith@gmail.com',
	password: 'Password@1',
} as const;

// **** Functions **** //

/**
 * Login a user.
 */
function login(beforeAgent: SuperTest<Test>, done: (arg: string) => void) {
	// Setup dummy data
	const role = UserRoles.Admin,
		pwdHash = PwdUtil.hashSync(LoginCreds.password),
		loginUser = User.new('john smith', LoginCreds.email, role, pwdHash);
	// Add spy
	spyOn(UserRepo, 'getOne').and.resolveTo(loginUser);
	// Call Login API
	beforeAgent
		.post(Paths.Auth.Login)
		.type('form')
		.send(LoginCreds)
		.end((_: Error, res: Response) => {
			return done(res.body.accessToken || '');
		});
}

// **** Export default **** //

export default login;
