import React from 'react';
import { fire,getFireDB } from './shared/firebase'
import './Main.scss'
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

class MapPage extends React.Component {

    constructor() {
        super();
        fire();

    }

    componentDidMount() {

    }

    render() {
        return (
                <Container fixed className="background-puple">
                    <CircularProgress className="circluar-progress-fix"  color="white" />
                </Container>
        );
    }
}

export default MapPage;
