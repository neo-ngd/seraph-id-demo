import { CardHeader, Avatar } from "@material-ui/core";
import { Agents } from "application-context";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React from "react";

function Header() {
    return (
        <CardHeader
            avatar={
                <Avatar aria-label="Recipe"> 
                    <AccountCircleIcon className="OwnerIcon" /> 
                </Avatar>
            }
            title={
                <div className="AgentCardTitle"> 
                    <div> 
                        <h1> {Agents.owner} </h1> 
                    </div> 
                    <div> 
                        <h2> Identity Owner </h2> 
                    </div> 
                </div>
            }
            className="AgentCardHeader"
        />
    )
}

export default React.memo(Header);