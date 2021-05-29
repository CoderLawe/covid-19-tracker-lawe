import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css'

function InfoBox({ title, cases, isRed, active, total, ...props }) { //Onclick will now appear here
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && "infoBox--red"}`}> 
        {/* String interpolation */}
            <CardContent>
                {/* Title */}
                <Typography className="infoBox__title "color="textSecondary">
                    {title}
                </Typography>
                {/* Number of cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}  </h2>

                <Typography className ="infoBox__total"color="textSecondary">
                    {total} total 
                </Typography>
                {/* Total */}
            </CardContent>
        </Card>
    )
}

export default InfoBox
