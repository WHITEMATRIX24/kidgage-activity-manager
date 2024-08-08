import React from 'react';
import Tabs from './Tabs';
import Button from './Button';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <Tabs>
        <div label={<><i className="fas fa-user tab-icon"></i> Parent</>}>
          <p>For parents and guardians</p>
          <Link to="/personal-signin"><Button primary>Log in to Kidgage</Button></Link>
          <Link to="/personal-signup"><Button>Create an Account</Button></Link>
        </div>
        <div label={<><i className="fas fa-building tab-icon"></i> Business</>}>
          <p>For business users</p>
          <Link to="/business-signin"><Button primary>Log in to Kidgage</Button></Link>
          <Link to="/business-signup"><Button>Create an Account</Button></Link>
        </div>
        <div label={<><i className="fas fa-user-cog tab-icon"></i> Admin</>}>
          <p>For Admin</p>
          <Link to="/admin-signin"><Button primary>Log in to Kidgage</Button></Link>
        </div>
      </Tabs>
    </div>
  );
};

export default Login;
