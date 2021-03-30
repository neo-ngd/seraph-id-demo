// Copyright (c) 2019 Swisscom Blockchain AG
// Licensed under MIT License

import * as React from 'react';
import './FlatCards.css';
import { theme } from '../../containers/App';
import { Typography, Fab, Card, CardActionArea, CardMedia, CardContent, CardActions } from '@material-ui/core';
import MediaQuery from 'react-responsive';


interface FlatCard {
    id: number;
    pictureRef: string;
    city: string;
    price: string;
    rooms: number;
    meters: number;
    others: string;
}

interface Props {
    flatBooked: any;
}

function FlatCards({ flatBooked }: Props) {

    const topFlats: FlatCard[] = [
        { id: 1, pictureRef: 'flat_1', city: 'Florence', price: '200', rooms: 2, meters: 65, others: 'Bathtub' },
        { id: 2, pictureRef: 'flat_2', city: 'Beijing', price: '280', rooms: 3, meters: 110, others: 'Garden' },
        { id: 3, pictureRef: 'flat_3', city: 'New York', price: '370', rooms: 4, meters: 155, others: 'Terrace' },
    ];

    const bottomFlats: FlatCard[] = [
        { id: 4, pictureRef: 'flat_4', city: 'Paris', price: '195', rooms: 2, meters: 54, others: 'Position' },
        { id: 5, pictureRef: 'flat_5', city: 'Zürich', price: '450', rooms: 5, meters: 240, others: 'Magnific view' },
        { id: 6, pictureRef: 'flat_6', city: 'Madrid', price: '210', rooms: 2, meters: 80, others: 'Pool' },
    ];

    const renderFlatsInRow = (flats: FlatCard[]) => {
        return flats.map(
            flat => {
                return (
                    <FlatCard
                        key={flat.id}
                        imageRef={flat.pictureRef}
                        city={flat.city}
                        price={flat.price}
                        rooms={flat.rooms}
                        meters={flat.meters}
                        others={flat.others}
                        clicked={() => flatBooked(flat.id, flat.city, flat.price)}
                    />
                );
            }
        );
    }

    return (
        <div className="FlatCardContainer">

            <MediaQuery query="(min-device-width: 1224px)">
                {/* desktop or laptop */}
                <div className="FlatCardRowContainer">
                    {renderFlatsInRow(topFlats)}
                </div>

                <div className="FlatCardRowContainer">
                    {renderFlatsInRow(bottomFlats)}
                </div>
            </MediaQuery>

            <MediaQuery query="(max-device-width: 1224px)">
                {/* tablet */}
                <MediaQuery query="(min-width: 750px)">

                    <div className="FlatCardRowContainer">
                        {renderFlatsInRow(topFlats.slice(0, 2))}
                    </div>

                    <div className="FlatCardRowContainer">
                        {renderFlatsInRow([topFlats[2], bottomFlats[0]])}
                    </div>

                    <div className="FlatCardRowContainer">
                        {renderFlatsInRow(bottomFlats.slice(1, 3))}
                    </div>

                </MediaQuery>

                {/* mobile */}
                <MediaQuery query="(max-width: 750px)">

                    <div className="FlatCardRowContainer">
                        {renderFlatsInRow([topFlats[0]])}
                    </div>

                    <div className="FlatCardRowContainer">
                        {renderFlatsInRow([topFlats[1]])}
                    </div>


                    <div className="FlatCardRowContainer">
                        {renderFlatsInRow([topFlats[2]])}
                    </div>

                    <div className="FlatCardRowContainer">
                        {renderFlatsInRow([bottomFlats[0]])}
                    </div>

                </MediaQuery>
            </MediaQuery>

        </div>

    );
}

export default FlatCards;


interface CardProps {
    imageRef: string;
    city: string;
    price: string;
    rooms: number;
    meters: number;
    others: string;
    clicked: any;
}



function FlatCard({ imageRef, city, price, rooms, meters, others, clicked }: CardProps) {

    const style = { backgroundColor: theme.palette.error.main, color: 'white' };

    return (
        <Card className="FlatCard">
            <CardActionArea>
                <CardMedia
                    className="FlatPicture"
                    image={require(`../../assets/${imageRef}.jpg`)}
                    title="Contemplative Reptile"
                />
                <CardContent className="FlatCardContent">

                    <div className="FlatCardTitle">
                        <Typography gutterBottom variant="h6" component="h2">
                            {city}
                        </Typography>

                        <Typography gutterBottom variant="h5" component="h2">
                            <strong> {price} $ </strong>
                            <small className="PriceSpec"> /night </small>
                        </Typography>
                    </div>
                    <Typography component="p" >
                        <strong> Rooms: </strong> {rooms}
                        <br />
                        <strong> Square meteres: </strong> {meters} m<sup>2</sup>
                        <br />
                        <strong> Plus: </strong> {others}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className="FlatCardActions">
                <div></div>
                <Fab size="medium" variant="extended" style={style} onClick={clicked}>
                    Book
                </Fab>
            </CardActions>
        </Card>
    );
}
