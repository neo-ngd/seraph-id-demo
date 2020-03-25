import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { useContext } from 'react';
import { GlobalContext } from 'containers/GlobalContext';

export const CodeDialog = React.memo(() => {
    const { state: { dialog: {open, code, title}}, dispatch } = useContext(GlobalContext);

    function onClose() {
        dispatch({
            type: 'CLOSE'
        })
    }

    return (
        <Dialog open={open} maxWidth="lg" onClose={onClose}>
            <DialogTitle> {title} </DialogTitle>
            <div>
                <DialogContent className="DialogContent DialogContentPadding">
                    <div className="DialogCodeContainer">
                        <pre>
                            <code>
                                {code}
                            </code>
                        </pre>
                    </div>
                </DialogContent>
        
            </div>
        </Dialog>
    )
});