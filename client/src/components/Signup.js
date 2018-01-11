import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import '../style/login.css';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag';
import {GQL_JWT_TOKEN,GQL_USER_ID} from '../constants';
import { SIGNUP_USER_MUTATION } from '../queries';
import * as acts from '../actions/index';
import {connect} from 'react-redux';

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            username: "",
            email: "",
            password: ""
        }
        this.handleSignup = this.handleSignup.bind(this);
    }
    _saveUserData = (id, token) => {
        localStorage.setItem(GQL_USER_ID, id)
        localStorage.setItem(GQL_JWT_TOKEN, token)
    }
    async handleSignup (e) {
        e.preventDefault();
        const { name, username, email, password} = this.state;
        
        const result = await this.props.signupUser({
            variables: {
                name,
                username,
                email,
                password
            }
        });
        const token = result.data.createUser.token;
        const id = result.data.createUser.user.id;
        this._saveUserData(id,token);
        this.props.history.push('/app')
    }
    render(){
        console.log(this.props)
        return (
            <div className="login-page">
                <div className="form">
                    <form className="login-form">
                        <input type="text" placeholder="name" value={this.state.name} onChange={e => this.setState({name: e.target.value})}/>
                        <input type="text" placeholder="username" value={this.state.username} onChange={e => this.setState({username: e.target.value})}/>
                        <input type="password" placeholder="password" value={this.state.password} onChange={e => this.setState({password: e.target.value})}/>
                        <input type="text" placeholder="email address" value={this.state.email} onChange={e => this.setState({email: e.target.value})}/>
                        <button onClick={this.handleSignup}>Buat</button>
                        <p className="message">Sudah Punya Akun? <Link to="/login" >Masuk</Link></p>
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(null,acts)(graphql(SIGNUP_USER_MUTATION, { name: 'signupUser' })(Signup));