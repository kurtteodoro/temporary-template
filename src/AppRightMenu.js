import React, { useState } from 'react';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';

const AppRightPanel = (props) => {
    const [date, setDate] = useState(null);

    return (
        <div className={classNames('layout-rightmenu', { 'layout-rightmenu-active': props.rightMenuActive })} onClick={props.onRightMenuClick}>
            <button onClick={() => props.onRightMenuActiveChange(false)} className="layout-rightmenu-close p-link">
                <i className="pi pi-times"></i>
            </button>
            <div className="user-detail-wrapper">
                <div className="user-detail-content">
                    <img src="assets/layout/images/dashboard/gene.png" alt="atlantis" className="user-image" />
                    <span className="user-name">Gene Russell</span>
                    <span className="user-number">(406) 555-0120</span>
                </div>
                <div className="user-tasks">
                    <div className="user-tasks-item in-progress">
                        <button className="task-number p-link">23</button>
                        <span className="task-name">Progress</span>
                    </div>
                    <div className="user-tasks-item">
                        <button className="task-number p-link">6</button>
                        <span className="task-name">Overdue</span>
                    </div>
                    <div className="user-tasks-item">
                        <button className="task-number p-link">38</button>
                        <span className="task-name">All deals</span>
                    </div>
                </div>
            </div>
            <div>
                <Calendar value={date} onChange={(e) => setDate(e.value)} inline></Calendar>
            </div>
            <div className="daily-plan-wrapper">
                <span className="today-date">14 Sunday, Jun 2020</span>
                <ul>
                    <li>
                        <span className="event-time">1:00 PM - 2:00 PM</span>
                        <span className="event-topic">Meeting with Alfredo Rhiel Madsen</span>
                    </li>
                    <li>
                        <span className="event-time">2:00 PM - 3:00 PM</span>
                        <span className="event-topic">Team Sync</span>
                    </li>
                    <li>
                        <span className="event-time">5:00 PM - 6:00 PM</span>
                        <span className="event-topic">Team Sync</span>
                    </li>
                    <li>
                        <span className="event-time">7:00 PM - 7:30 PM</span>
                        <span className="event-topic">Meeting with Engineering managers</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AppRightPanel;
