import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ChangeEmail from '../registration/ChangeEmail';
import ChangePassword from '../registration/ChangePassword';
import LoginForm from "../registration/LoginForm";
import RecoveryEmailForm from '../registration/RecoveryEmailForm';
import ResetPassword from '../registration/ResetPassword';
import SignUpForm from '../registration/SignUpForm';
import useToken from "../registration/UseToken";
import ViewAuthInfo from "../registration/ViewAuthInfo";
import MainView from './MainView';

const HomeScreen = () => {
    const {token, setToken} = useToken();

    return (
        <BrowserRouter>
            <div className="App">
                {!token ? (
                    <div>
                    <Routes>
                        <Route path="/" element={<LoginForm setToken={setToken}/>} />
                        <Route path="/signUpForm" element={<SignUpForm />} />
                        <Route path="/recoveryEmailForm" element={<RecoveryEmailForm/>}/>
                        <Route path="/reset_password/:token/:user_id" element={<ResetPassword />} />
                    </Routes>
                    </div>
                ) : (
                    <div>
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/credentials">Credentials</Link>
                                </li>
                            </ul>
                        </nav>

                        <Routes>
                            <Route path="/" element={<MainView/>} />
                            <Route path="/credentials" >
                                <Route index element={<ViewAuthInfo/>} />
                                <Route path="changeEmail" element={<ChangeEmail/>} />
                                <Route path="recoveryEmailForm" element={<RecoveryEmailForm/>}/>
                                <Route path="changePassword" element={<ChangePassword />} />

                            </Route>
                        </Routes>

                        
                    </div>
                )}
            </div>
        </BrowserRouter>
        
    );
};

export default HomeScreen;
    





