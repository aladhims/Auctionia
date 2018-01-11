import { LinearProgress } from 'material-ui/Progress';
import { connect } from 'react-redux';
import React from 'react';

const Ldng = (props) => {
    const {loading} = props;
    return loading ? <LinearProgress 
    mode="query" 
    color="accent" 
    style={{zIndex: '2000',width: '100%', position: 'absolute', top: '0', left: '0'}}/>
    :
    null;
    
}

const mapStateToProps = ({loading}) => {
    return {loading};
}

export default connect(mapStateToProps)(Ldng);

