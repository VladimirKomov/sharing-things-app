import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarWithDisabledDatesProps {
    bookedDates: (string | Date)[];
}

const CalendarWithDisabledDates: React.FC<CalendarWithDisabledDatesProps> = ({ bookedDates }) => {
    const disabledDates = bookedDates.map(date => new Date(date));

    return (
        <Box>
            <Typography variant="h6">Booked Dates:</Typography>
            <ReactDatePicker
                inline
                highlightDates={[{ "react-datepicker__day--highlighted": disabledDates }]}
                excludeDates={disabledDates}
                dayClassName={date =>
                    disabledDates.some(disabledDate =>
                        date.getFullYear() === disabledDate.getFullYear() &&
                        date.getMonth() === disabledDate.getMonth() &&
                        date.getDate() === disabledDate.getDate()
                    ) ? 'highlighted-date' : ''
                }
            />
            <style>
                {`
            .highlighted-date {
                background-color: #ffcccc;
                color: #ff0000;
            }
        `}
            </style>
        </Box>

    );
};

export default CalendarWithDisabledDates;
