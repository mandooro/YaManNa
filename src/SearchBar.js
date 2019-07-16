import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';

// TODO 해인아 요기 수정하면대
class SearchBar extends React.Component {

    constructor() {
        super();
        this.state = {
            searchDialog: false
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClick() {
        this.setState({ searchDialog: true });
    }

    handleClose = () => {
        this.setState({ searchDialog: false });
    };

    render() {
        return (
            <div>
                <TextField
                    id="standard-search"
                    label="Search field"
                    type="search"
                    margin="normal"
                    onClick={this.handleClick}
                />
                <Dialog
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.searchDialog}
                >
                    <TextField
                        id="standard-search2"
                        label="Search field"
                        type="search"
                        margin="normal"
                    />
                </Dialog>
            </div>
        );
    }
}

export default SearchBar;
