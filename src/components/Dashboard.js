import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Carousel } from 'primereact/carousel';
import { Timeline } from 'primereact/timeline';
import CustomerService from '../service/CustomerService';

const visitorChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Plan',
            data: [630, 630, 695, 695, 695, 760, 760, 760, 840, 840, 840, 840],
            borderColor: ['#FC6161'],
            pointBorderColor: 'transparent',
            pointBackgroundColor: 'transparent',
            type: 'line',
            fill: false,
            barPercentage: 0.5,
            stepped: true
        },
        {
            label: 'Growth actual',
            data: [600, 671, 660, 665, 700, 610, 810, 790, 710, 860, 810, 780],
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--primary-color'),
            fill: true,
            barPercentage: 0.5
        }
    ]
};

const visitorChartOptions = {
    plugins: {
        legend: {
            position: 'top',
            align: 'end'
        }
    },
    responsive: true,
    hover: {
        mode: 'index'
    },
    scales: {
        y: {
            min: 500,
            max: 900,
            grid: {
                display: false
            }
        },
        x: {
            grid: {
                display: false
            }
        }
    }
};

const countryChart = {
    labels: ['RUS', 'Other', 'IND', 'AUS', 'JPN', 'USA', 'CHN'],
    datasets: [
        {
            data: [30, 18, 36, 54, 61, 90, 72],
            backgroundColor: ['#0F8BFD', '#545C6B', '#EC4DBC', '#EEE500', '#FC6161', '#00D0DE', '#873EFE'],
            hoverBackgroundColor: ['#0F8BFD', '#545C6B', '#EC4DBC', '#EEE500', '#FC6161', '#00D0DE', '#873EFE'],
            borderColor: 'transparent',
            fill: true
        }
    ]
};

const countryChartOptions = {
    responsive: true
};

const revenueChart = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Sales',
            data: [37, 34, 21, 27, 10, 18, 15],
            borderColor: '#EEE500',
            pointBackgroundColor: '#EEE500',
            backgroundColor: 'rgba(238, 229, 0, 0.05)',
            fill: true,
            tension: 0.4
        },
        {
            label: 'Revenue',
            data: [31, 27, 30, 37, 23, 29, 20],
            borderColor: '#00D0DE',
            pointBackgroundColor: '#00D0DE',
            backgroundColor: 'rgba(0, 208, 222, 0.05)',
            fill: true,
            tension: 0.4
        },
        {
            label: 'Expenses',
            data: [21, 7, 13, 3, 19, 11, 6],
            borderColor: '#FC6161',
            pointBackgroundColor: '#FC6161',
            backgroundColor: 'rgba(253, 72, 74, 0.05)',
            fill: true,
            tension: 0.4
        },
        {
            label: 'Customer',
            data: [47, 31, 35, 20, 46, 39, 25],
            borderColor: '#0F8BFD',
            pointBackgroundColor: '#0F8BFD',
            backgroundColor: 'rgba(15, 139, 253, 0.05)',
            fill: true,
            tension: 0.4
        }
    ]
};

const revenueChartOptions = {
    responsive: true,
    hover: {
        mode: 'index'
    },
    scales: {
        y: {
            min: 0,
            max: 50,
            ticks: {
                stepSize: 5
            }
        }
    }
};

const customerChart = {
    labels: ['January', 'March', 'May', 'Agust', 'October', 'December'],
    datasets: [
        {
            data: [10, 25, 48, 35, 54, 70],
            backgroundColor: '#AAABDD',
            hoverBackgroundColor: '#AAABDD',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [18, 35, 23, 30, 59, 65],
            backgroundColor: '#A0A0D9',
            hoverBackgroundColor: '#A0A0D9',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [20, 47, 46, 46, 61, 70],
            backgroundColor: '#ACADDE',
            hoverBackgroundColor: '#ACADDE',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [17, 34, 18, 48, 67, 68],
            backgroundColor: '#ABABDD',
            hoverBackgroundColor: '#ABABDD',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [9, 37, 47, 50, 60, 62],
            backgroundColor: '#A2A3D9',
            hoverBackgroundColor: '#A2A3D9',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [8, 48, 40, 52, 72, 75],
            backgroundColor: '#A3A4DA',
            hoverBackgroundColor: '#A3A4DA',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [10, 18, 50, 47, 63, 80],
            backgroundColor: '#A2A3D9',
            hoverBackgroundColor: '#A2A3D9',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [20, 36, 39, 58, 59, 85],
            backgroundColor: '#8485CD',
            hoverBackgroundColor: '#8485CD',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [30, 45, 35, 50, 54, 81],
            backgroundColor: '#7D7ECA',
            hoverBackgroundColor: '#7D7ECA',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [28, 35, 52, 56, 60, 77],
            backgroundColor: '#8384CD',
            hoverBackgroundColor: '#8384CD',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [40, 40, 38, 45, 68, 86],
            backgroundColor: '#8F90D2',
            hoverBackgroundColor: '#8F90D2',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [50, 23, 27, 34, 65, 90],
            backgroundColor: '#8C8DD0',
            hoverBackgroundColor: '#8C8DD0',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [29, 27, 29, 42, 55, 84],
            backgroundColor: '#9495D4',
            hoverBackgroundColor: '#9495D4',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [10, 37, 47, 29, 59, 80],
            backgroundColor: '#9696D4',
            hoverBackgroundColor: '#9696D4',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [10, 54, 42, 38, 63, 83],
            backgroundColor: '#7273C6',
            hoverBackgroundColor: '#7273C6',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [25, 44, 50, 56, 65, 92],
            backgroundColor: '#5F60BE',
            hoverBackgroundColor: '#5F60BE',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [30, 43, 48, 45, 73, 78],
            backgroundColor: '#5C5DBD',
            hoverBackgroundColor: '#5C5DBD',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        },
        {
            data: [29, 47, 54, 60, 77, 86],
            backgroundColor: '#5C5DBD',
            hoverBackgroundColor: '#5C5DBD',
            fill: true,
            categoryPercentage: 1.0,
            barPercentage: 1.0
        }
    ]
};

const customerChartOptions = {
    interaction: {
        mode: 'x'
    },
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            display: false
        },
        x: {
            grid: {
                display: false
            }
        }
    }
};

const Dashboard = () => {
    const orderYear = [
        { name: '2021', code: '0' },
        { name: '2020', code: '1' }
    ];
    const visitorYear = [
        { name: '2020', code: '0' },
        { name: '2019', code: '1' }
    ];
    const customerYear = [
        { name: '2021', code: '0' },
        { name: '2022', code: '1' }
    ];
    const revenueMonth = [
        { name: 'January - July 2021', code: '0' },
        { name: 'August - December 2020', code: '1' }
    ];

    const [customersTable, setCustomersTable] = useState(null);
    const [customersTable1, setCustomersTable1] = useState(null);
    const [customersTable2, setCustomersTable2] = useState(null);
    const [selectedVisitorYear, setSelectedVisitorYear] = useState(visitorYear[0]);
    const [selectedRevenueMonth, setSelectedRevenueMonth] = useState(revenueMonth[0]);
    const [selectedOrderYear, setSelectedOrderYear] = useState(orderYear[0]);
    const [selectedCustomerYear, setSelectedCustomerYear] = useState(customerYear[0]);
    const [customerCarousel, setCustomerCarousel] = useState([]);

    const visitor = useRef(null);
    const customer = useRef(null);
    const revenue = useRef(null);
    const dt = useRef(null);

    let growth = '$620,076';
    let avgCustomer = '$1,120';

    const timelineEvents = [
        {
            transaction: 'Payment from #28492',
            amount: '+$250.00',
            date: 'June 13, 2020 11:09 AM',
            icon: 'pi pi-check',
            iconColor: '#0F8BFD',
            amountColor: '#00D0DE'
        },
        {
            transaction: 'Process refund to #94830',
            amount: '-$570.00',
            date: 'June 13, 2020 08:22 AM',
            icon: 'pi pi-refresh',
            iconColor: '#FC6161',
            amountColor: '#FC6161'
        },
        {
            transaction: 'New 8 user to #5849',
            amount: '+$50.00',
            date: 'June 12, 2020 02:56 PM',
            icon: 'pi pi-plus',
            iconColor: '#0BD18A',
            amountColor: '#0BD18A'
        },
        {
            transaction: 'Payment from #3382',
            amount: '+$3830.00',
            date: 'June 11, 2020 06:11 AM',
            icon: 'pi pi-check',
            iconColor: '#0F8BFD',
            amountColor: '#00D0DE'
        },
        {
            transaction: 'Payment from #4738',
            amount: '+$845.00',
            date: 'June 11, 2020 03:50 AM',
            icon: 'pi pi-check',
            iconColor: '#0F8BFD',
            amountColor: '#00D0DE'
        },
        {
            transaction: 'Payment failed form #60958',
            amount: '$1450.00',
            date: 'June 10, 2020 07:54 PM',
            icon: 'pi pi-exclamation-triangle',
            iconColor: '#EC4DBC',
            amountColor: '#EC4DBC'
        },
        {
            transaction: 'Payment from #5748',
            amount: '+$50.00',
            date: 'June 09, 2020 11:37 PM',
            icon: 'pi pi-check',
            iconColor: '#0F8BFD',
            amountColor: '#00D0DE'
        },
        {
            transaction: 'Removed 32 users from #5849',
            amount: '-$240.00',
            date: 'June 09, 2020 08:40 PM',
            icon: 'pi pi-minus',
            iconColor: '#FC6161',
            amountColor: '#FC6161'
        }
    ];

    const carouselResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    let customerMax = '1232';
    let customerMin = '284';
    let customerAvg = '875';

    useEffect(() => {
        const customerService = new CustomerService();

        customerService.getCustomersLarge().then((customers) => {
            const _customersTable = customers.map((customer) => {
                let date = new Date(customer.date);
                return { ...customer, date };
            });
            setCustomersTable(_customersTable);
        });

        customerService.getCustomersLarge().then((customers) => {
            const _customersTable1 = customers.map((customer) => {
                let date = new Date(customer.date);
                return { ...customer, date };
            });
            setCustomersTable1(_customersTable1);
        });

        customerService.getCustomersMixed().then((customers) => {
            const _customersTable2 = customers.map((customer) => {
                let date = new Date(customer.date);
                return { ...customer, date };
            });
            setCustomersTable2(_customersTable2);
        });

        setCustomerCarousel([
            { user: '9,673 Users', value: '$8,362,478', image: 'nasa' },
            { user: '9,395 Users', value: '$7,927,105', image: 'beats' },
            { user: '7,813 Users', value: '$6,471,594', image: 'gopro' },
            { user: '7,613 Users', value: '$5,697,883', image: 'north' },
            { user: '98,673 Users', value: '$7,653,311', image: 'mc' },
            { user: '5,645 Users', value: '$4,567,823', image: 'dell' },
            { user: '5,153 Users', value: '$5,342,678', image: 'wwf' },
            { user: '4,338 Users', value: '$5,867,391', image: 'bmw' },
            { user: '4,170 Users', value: '$4,647,233', image: 'pepsi' },
            { user: '3,765 Users', value: '$4,123,876', image: 'netflix' },
            { user: '3,490 Users', value: '$3,688,362', image: 'deloitte' },
            { user: '2,976 Users', value: '$3,978,478', image: 'pg' }
        ]);
    }, []);

    const changeRevenueChart = (event) => {
        setSelectedRevenueMonth(event.value);
        const dataSet1 = [
            [37, 34, 21, 27, 10, 18, 15],
            [31, 27, 30, 37, 23, 29, 20],
            [21, 7, 13, 3, 19, 11, 6],
            [47, 31, 35, 20, 46, 39, 25]
        ];
        const dataSet2 = [
            [31, 27, 30, 37, 23, 29, 20],
            [47, 31, 35, 20, 46, 39, 25],
            [37, 34, 21, 27, 10, 18, 15],
            [21, 7, 13, 3, 19, 11, 6]
        ];

        if (event.value.code === '1') {
            revenueChart.datasets[0].data = dataSet2[parseInt('0')];
            revenueChart.datasets[1].data = dataSet2[parseInt('1')];
            revenueChart.datasets[2].data = dataSet2[parseInt('2')];
            revenueChart.datasets[3].data = dataSet2[parseInt('3')];
        } else {
            revenueChart.datasets[0].data = dataSet1[parseInt('0')];
            revenueChart.datasets[1].data = dataSet1[parseInt('1')];
            revenueChart.datasets[2].data = dataSet1[parseInt('2')];
            revenueChart.datasets[3].data = dataSet1[parseInt('3')];
        }

        revenue.current.refresh();
    };

    const changeVisitorChart = (event) => {
        setSelectedVisitorYear(event.value);
        const dataSet1 = [
            [630, 630, 695, 695, 695, 760, 760, 760, 840, 840, 840, 840],
            [600, 671, 660, 665, 700, 610, 810, 790, 710, 860, 810, 780]
        ];
        const dataSet2 = [
            [580, 580, 620, 620, 620, 680, 680, 680, 730, 730, 730, 730],
            [550, 592, 600, 605, 630, 649, 660, 690, 710, 720, 730, 780]
        ];

        if (event.value.code === '1') {
            growth = '$581,259';
            avgCustomer = '$973';
            visitorChart.datasets[0].data = dataSet2[parseInt('0')];
            visitorChart.datasets[1].data = dataSet2[parseInt('1')];
        } else {
            growth = '$620,076';
            avgCustomer = '$1,120';
            visitorChart.datasets[0].data = dataSet1[parseInt('0')];
            visitorChart.datasets[1].data = dataSet1[parseInt('1')];
        }

        visitor.current.refresh();
    };

    const changeCustomerChart = (event) => {
        setSelectedCustomerYear(event.value);
        const dataSet1 = [
            [10, 25, 48, 35, 54, 70],
            [18, 35, 23, 30, 59, 65],
            [20, 47, 46, 46, 61, 70],
            [17, 34, 18, 48, 67, 68],
            [9, 37, 47, 50, 60, 62],
            [8, 48, 40, 52, 72, 75],
            [10, 18, 50, 47, 63, 80],
            [20, 36, 39, 58, 59, 85],
            [30, 45, 35, 50, 54, 81],
            [28, 35, 52, 56, 60, 77],
            [40, 40, 38, 45, 68, 86],
            [50, 23, 27, 34, 65, 90],
            [29, 27, 29, 42, 55, 84],
            [10, 37, 47, 29, 59, 80],
            [10, 54, 42, 38, 63, 83],
            [25, 44, 50, 56, 65, 92],
            [30, 43, 48, 45, 73, 78],
            [29, 47, 54, 60, 77, 86]
        ];
        const dataSet2 = [
            [10, 25, 48, 35, 54, 70],
            [20, 47, 46, 46, 61, 70],
            [17, 34, 18, 48, 67, 68],
            [50, 23, 27, 34, 65, 90],
            [8, 48, 40, 52, 72, 75],
            [9, 37, 47, 50, 60, 62],
            [10, 18, 50, 47, 63, 80],
            [30, 45, 35, 50, 54, 81],
            [10, 37, 47, 29, 59, 80],
            [28, 35, 52, 56, 60, 77],
            [25, 44, 50, 56, 65, 92],
            [18, 35, 23, 30, 59, 65],
            [20, 36, 39, 58, 59, 85],
            [29, 27, 29, 42, 55, 84],
            [40, 40, 38, 45, 68, 86],
            [30, 43, 48, 45, 73, 78],
            [10, 54, 42, 38, 63, 83],
            [29, 47, 54, 60, 77, 86]
        ];

        if (event.value.code === '1') {
            customerAvg = '621';
            customerMin = '198';
            customerMax = '957';
            customerChart.datasets[0].data = dataSet2[parseInt('0')];
            customerChart.datasets[1].data = dataSet2[parseInt('1')];
            customerChart.datasets[2].data = dataSet2[parseInt('2')];
            customerChart.datasets[3].data = dataSet2[parseInt('3')];
            customerChart.datasets[4].data = dataSet2[parseInt('4')];
            customerChart.datasets[5].data = dataSet2[parseInt('5')];
            customerChart.datasets[6].data = dataSet2[parseInt('6')];
            customerChart.datasets[7].data = dataSet2[parseInt('7')];
            customerChart.datasets[8].data = dataSet2[parseInt('8')];
            customerChart.datasets[9].data = dataSet2[parseInt('9')];
            customerChart.datasets[10].data = dataSet2[parseInt('10')];
            customerChart.datasets[11].data = dataSet2[parseInt('11')];
            customerChart.datasets[12].data = dataSet2[parseInt('12')];
            customerChart.datasets[13].data = dataSet2[parseInt('13')];
            customerChart.datasets[14].data = dataSet2[parseInt('14')];
            customerChart.datasets[15].data = dataSet2[parseInt('15')];
            customerChart.datasets[16].data = dataSet2[parseInt('16')];
            customerChart.datasets[17].data = dataSet2[parseInt('17')];
        } else {
            customerAvg = '875';
            customerMin = '284';
            customerMax = '1232';
            customerChart.datasets[0].data = dataSet1[parseInt('0')];
            customerChart.datasets[1].data = dataSet1[parseInt('1')];
            customerChart.datasets[2].data = dataSet1[parseInt('2')];
            customerChart.datasets[3].data = dataSet1[parseInt('3')];
            customerChart.datasets[4].data = dataSet1[parseInt('4')];
            customerChart.datasets[5].data = dataSet1[parseInt('5')];
            customerChart.datasets[6].data = dataSet1[parseInt('6')];
            customerChart.datasets[7].data = dataSet1[parseInt('7')];
            customerChart.datasets[8].data = dataSet1[parseInt('8')];
            customerChart.datasets[9].data = dataSet1[parseInt('9')];
            customerChart.datasets[10].data = dataSet1[parseInt('10')];
            customerChart.datasets[11].data = dataSet1[parseInt('11')];
            customerChart.datasets[12].data = dataSet1[parseInt('12')];
            customerChart.datasets[13].data = dataSet1[parseInt('13')];
            customerChart.datasets[14].data = dataSet1[parseInt('14')];
            customerChart.datasets[15].data = dataSet1[parseInt('15')];
            customerChart.datasets[16].data = dataSet1[parseInt('16')];
            customerChart.datasets[17].data = dataSet1[parseInt('17')];
        }

        customer.current.refresh();
    };

    const recentSales = (event) => {
        setSelectedOrderYear(event.value);
        if (event.value.code === '0') {
            setCustomersTable(customersTable1);
        } else {
            setCustomersTable(customersTable2);
        }
    };

    const formatDate = (value) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {value.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </>
        );
    };

    const formatCurrency = (value) => {
        return (
            <>
                <span className="p-column-title">Balance</span>
                {value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </>
        );
    };

    const representativeTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Agent</span>
                <img alt={data.representative.name} src={'assets/demo/images/avatar/' + data.representative.image} width={24} className="mr-2" style={{ verticalAlign: 'middle' }} />
                <span className="image-text">{data.representative.name}</span>
            </>
        );
    };

    const actionTemplate = () => {
        return (
            <>
                <Button className="p-button-text" icon="pi pi-copy"></Button>
                <Button className="p-button-text" icon="pi pi-pencil"></Button>
                <Button className="p-button-text" icon="pi pi-ellipsis-h"></Button>
            </>
        );
    };

    const countryTemplate = (data, props) => {
        return (
            <>
                <span className="p-column-title">{props.header}</span>
                <span className="ml-2" style={{ verticalAlign: 'middle' }}>
                    {data.country.name}
                </span>
            </>
        );
    };

    const itemTemplate = (customer) => {
        return (
            <div className="card mr-4">
                <div className="customer-item-content">
                    <div className="mb-6">
                        <img src={'assets/layout/images/dashboard/' + customer.image + '.png'} alt={customer.image} className="product-image" />
                    </div>
                    <div>
                        <h4>{customer.user}</h4>
                        <h5 className="mt-0 mb-3">{customer.value}</h5>
                    </div>
                </div>
            </div>
        );
    };

    const marker = (item) => {
        return (
            <span className="custom-marker" style={{ backgroundColor: item.iconColor }}>
                <i className={item.icon}></i>
            </span>
        );
    };

    const content = (item) => {
        return (
            <>
                <div className="flex align-items-center justify-content-between">
                    <p>{item.transaction}</p>
                    <h6 style={{ color: item.amountColor }}> {item.amount}</h6>
                </div>
                <span>{item.date}</span>
            </>
        );
    };

    return (
        <div className="layout-dashboard">
            <div className="grid">
                <div className="col-12 md:col-4">
                    <div className="card widget-overview-box widget-overview-box-1">
                        <span className="overview-title">CONVERSATION RATE</span>
                        <div className="flex justify-content-between">
                            <div className="overview-detail flex justify-content-between">
                                <div className="overview-badge flex justify-content-center align-items-center">
                                    <i className="pi pi-arrow-down"></i>
                                    <span>0.6%</span>
                                </div>
                                <div className="overview-text">0.81%</div>
                            </div>
                        </div>
                        <img src="assets/layout/images/dashboard/rate.svg" alt="rate" />
                    </div>
                </div>
                <div className="col-12 md:col-4">
                    <div className="card widget-overview-box widget-overview-box-2">
                        <span className="overview-title">AVG. ORDER VALUE</span>
                        <div className="flex justify-content-between">
                            <div className="overview-detail flex justify-content-between">
                                <div className="overview-badge flex justify-content-center align-items-center">
                                    <i className="pi pi-arrow-up"></i>
                                    <span>4,2%</span>
                                </div>
                                <div className="overview-text">$306.2</div>
                            </div>
                        </div>
                        <img src="assets/layout/images/dashboard/value.svg" alt="value" />
                    </div>
                </div>
                <div className="col-12 md:col-4">
                    <div className="card widget-overview-box widget-overview-box-3">
                        <span className="overview-title">ORDER QUANTITY</span>
                        <div className="flex justify-content-between">
                            <div className="overview-detail flex justify-content-between">
                                <div className="overview-badge flex justify-content-center align-items-center">
                                    <i className="pi pi-minus"></i>
                                    <span>2,1%</span>
                                </div>
                                <div className="overview-text">1,620</div>
                            </div>
                        </div>
                        <img src="assets/layout/images/dashboard/quantity.svg" alt="quantity" />
                    </div>
                </div>

                <div className="col-12 md:col-8">
                    <div className="card widget-visitor-graph">
                        <div className="card-header">
                            <span>Unique visitor graph</span>
                            <Dropdown options={visitorYear} value={selectedVisitorYear} optionLabel="name" onChange={changeVisitorChart}></Dropdown>
                        </div>

                        <div className="graph-content grid">
                            <div className="col-12 md:col-6">
                                <h2>{growth}</h2>
                                <h6>MRR GROWTH</h6>
                                <p>
                                    Measure how fast you’re growing mothly recurring revenue. <button className="p-link">Learn more</button>
                                </p>
                            </div>
                            <div className="col-12 md:col-6">
                                <h2>{avgCustomer}</h2>
                                <h6>AVG. MRR/CUSTOMER</h6>
                                <p>
                                    The revenue generated per account on a monthly or yearly basis. <button className="p-link">Learn more</button>
                                </p>
                            </div>
                        </div>

                        <div className="graph">
                            <h6>Revenue</h6>
                            <Chart ref={visitor} type="bar" data={visitorChart} options={visitorChartOptions} id="visitor-chart"></Chart>
                        </div>
                    </div>
                </div>

                <div className="col-12 md:col-4">
                    <div className="card widget-timeline">
                        <div className="timeline-header flex justify-content-between align-items-center">
                            <p>Transaction history</p>
                            <div className="header-icons">
                                <i className="pi pi-refresh"></i>
                                <i className="pi pi-filter"></i>
                            </div>
                        </div>
                        <div className="timeline-content">
                            <Timeline value={timelineEvents} marker={marker} content={content} className="custimized-timeline" />
                        </div>
                        <div className="timeline-footer flex align-items-center justify-content-center">
                            <button className="p-link">
                                View all transactions <i className="pi pi-arrow-down"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 md:col-4">
                    <div className="card widget-country-graph">
                        <div className="country-title">Country distrubutions</div>
                        <div className="country-graph flex justify-content-center">
                            <Chart type="doughnut" id="country-chart" data={countryChart} options={countryChartOptions} style={{ position: 'relative', width: '75%' }}></Chart>
                        </div>
                        <div className="country-content">
                            <ul>
                                <li className="flex justify-content-between align-items-center">
                                    <div className="flex justify-content-between align-items-center">
                                        <div
                                            className="color"
                                            style={{
                                                backgroundColor: '#00D0DE',
                                                boxShadow: '0px 0px 10px rgba(0, 208, 222, 0.3)'
                                            }}
                                        ></div>
                                        <span>United States of America</span>
                                    </div>
                                    <span>25%</span>
                                </li>
                                <li className="flex justify-content-between align-items-center">
                                    <div className="flex justify-content-between align-items-center">
                                        <div
                                            className="color"
                                            style={{
                                                backgroundColor: '#873EFE',
                                                boxShadow: '0px 0px 10px rgba(135, 62, 254, 0.3)'
                                            }}
                                        ></div>
                                        <span>China</span>
                                    </div>
                                    <span>20%</span>
                                </li>
                                <li className="flex justify-content-between align-items-center">
                                    <div className="flex justify-content-between align-items-center">
                                        <div
                                            className="color"
                                            style={{
                                                backgroundColor: '#FC6161',
                                                boxShadow: '0px 0px 10px rgba(252, 97, 97, 0.3)'
                                            }}
                                        ></div>
                                        <span>Japan</span>
                                    </div>
                                    <span>17%</span>
                                </li>
                                <li className="flex justify-content-between align-items-center">
                                    <div className="flex justify-content-between align-items-center">
                                        <div
                                            className="color"
                                            style={{
                                                backgroundColor: '#EEE500',
                                                boxShadow: '0px 0px 10px rgba(238, 229, 0, 0.3)'
                                            }}
                                        ></div>
                                        <span>Australia</span>
                                    </div>
                                    <span>15%</span>
                                </li>
                                <li className="flex justify-content-between align-items-center">
                                    <div className="flex justify-content-between align-items-center">
                                        <div
                                            className="color"
                                            style={{
                                                backgroundColor: '#EC4DBC',
                                                boxShadow: '0px 0px 10px rgba(236, 77, 188, 0.3)'
                                            }}
                                        ></div>
                                        <span>India</span>
                                    </div>
                                    <span>10%</span>
                                </li>
                                <li className="flex justify-content-between align-items-center">
                                    <div className="flex justify-content-between align-items-center">
                                        <div
                                            className="color"
                                            style={{
                                                backgroundColor: '#0F8BFD',
                                                boxShadow: '0px 0px 10px rgba(15, 139, 253, 0.3)'
                                            }}
                                        ></div>
                                        <span>Rusian Federation</span>
                                    </div>
                                    <span>8%</span>
                                </li>
                                <li className="flex justify-content-between align-items-center">
                                    <div className="flex justify-content-between align-items-center">
                                        <div className="color" style={{ backgroundColor: '#545C6B' }}></div>
                                        <span>Others</span>
                                    </div>
                                    <span>5%</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-12 md:col-8">
                    <div className="card widget-revenue-graph">
                        <div className="card-header">
                            <span>Monthly revenue</span>
                            <Dropdown options={revenueMonth} value={selectedRevenueMonth} optionLabel="name" onChange={changeRevenueChart}></Dropdown>
                        </div>

                        <div className="graph">
                            <Chart ref={revenue} type="line" id="revenue-chart" data={revenueChart} options={revenueChartOptions}></Chart>
                        </div>
                    </div>
                </div>

                <div className="col-12 md:col-8">
                    <div className="card widget-table">
                        <div className="card-header">
                            <span>Yearly win</span>
                            <Dropdown options={orderYear} value={selectedOrderYear} optionLabel="name" onChange={recentSales}></Dropdown>
                        </div>
                        <DataTable className="p-datatable-customers" ref={dt} value={customersTable} dataKey="id" rowHover rows={10} paginator>
                            <Column field="representative.name" header="Agent" sortable body={representativeTemplate} style={{ minWidth: '14rem' }}></Column>
                            <Column field="country.name" header="Country" sortable body={countryTemplate} style={{ minWidth: '10rem' }}></Column>
                            <Column field="date" header="Date" sortable body={(data) => formatDate(data.date)}></Column>
                            <Column field="balance" header="Balance" sortable body={(data) => formatCurrency(data.balance)}></Column>
                            <Column headerStyle={{ width: '8em' }} bodyStyle={{ textAlign: 'center' }} body={actionTemplate}></Column>
                        </DataTable>
                    </div>
                </div>

                <div className="col-12 md:col-4">
                    <div className="card widget-performance">
                        <div className="header">
                            <span>Quarterly win</span>
                            <p className="subtitle">Top performances</p>
                        </div>
                        <div className="content">
                            <ul>
                                <li className="person-item">
                                    <Avatar image="assets/layout/images/dashboard/ann.png" className="mr-2 p-overlay-badge" shape="circle">
                                        <Badge value={1} />
                                    </Avatar>
                                    <div className="person-info">
                                        <div className="amount">$94,815</div>
                                        <div className="name">Ann Vaccaro</div>
                                    </div>
                                </li>
                                <li className="person-item">
                                    <Avatar image="assets/layout/images/dashboard/miracle.png" className="mr-2 p-overlay-badge" shape="circle">
                                        <Badge value={2} />
                                    </Avatar>
                                    <div className="person-info">
                                        <div className="amount">$78,985</div>
                                        <div className="name">Miracle Aminoff</div>
                                    </div>
                                </li>
                                <li className="person-item">
                                    <Avatar image="assets/layout/images/dashboard/kaylynn.png" className="mr-2 p-overlay-badge" shape="circle">
                                        <Badge value={3} />
                                    </Avatar>
                                    <div className="person-info">
                                        <div className="amount">$53,611</div>
                                        <div className="name">Kaylynn Geidt</div>
                                    </div>
                                </li>
                                <li className="person-item">
                                    <Avatar image="assets/layout/images/dashboard/angel.png" className="mr-2 p-overlay-badge" shape="circle">
                                        <Badge value={4} />
                                    </Avatar>
                                    <div className="person-info">
                                        <div className="amount">$25,338</div>
                                        <div className="name">Angel Rosser</div>
                                    </div>
                                </li>
                                <li className="person-item">
                                    <Avatar image="assets/layout/images/dashboard/cristofer.png" className="mr-2 p-overlay-badge" shape="circle">
                                        <Badge value={5} />
                                    </Avatar>
                                    <div className="person-info">
                                        <div className="amount">$15,989</div>
                                        <div className="name">Cristofer Mango</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-12 lg:col-8">
                    <div className="card widget-customer-graph">
                        <div className="header">
                            <div className="title">
                                <span>Weekly new customers</span>
                                <Dropdown options={customerYear} value={selectedCustomerYear} optionLabel="name" onChange={changeCustomerChart}></Dropdown>
                            </div>
                            <p className="subtitle">Number of new customer are listed by weekly</p>
                        </div>

                        <div className="content grid grid-nogutter">
                            <div className="col-12 md:col-6 grid">
                                <div className="col-12 md:col-4 flex align-items-center">
                                    <h2>{customerMax}</h2>
                                    <p>MAX</p>
                                </div>
                                <div className="col-12 md:col-4 flex align-items-center">
                                    <h2>{customerMin}</h2>
                                    <p>MIN</p>
                                </div>
                                <div className="col-12 md:col-4 flex align-items-center">
                                    <h2 style={{ color: '#FC6161' }}>{customerAvg}</h2>
                                    <p>AVERAGE</p>
                                </div>
                            </div>
                        </div>

                        <Chart ref={customer} type="bar" id="customer-chart" data={customerChart} options={customerChartOptions}></Chart>
                    </div>
                </div>

                <div className="col-12 lg:col-4">
                    <div className="card widget-target">
                        <div className="card-header">
                            <span>Weekly target</span>
                        </div>
                        <div className="content">
                            <h3>1232 Users</h3>
                            <span className="rate">
                                %3.5 <i className="pi pi-arrow-up"></i>
                                <span> than last week</span>
                            </span>
                        </div>
                        <div className="values">
                            <div className="item">
                                <span>51%</span>
                                <ProgressBar value={51} showValue={false}></ProgressBar>
                                <span className="day">Thu</span>
                            </div>
                            <div className="item">
                                <span>68%</span>
                                <ProgressBar value={68} showValue={false}></ProgressBar>
                                <span className="day">Fri</span>
                            </div>
                            <div className="item">
                                <span>74%</span>
                                <ProgressBar value={74} showValue={false}></ProgressBar>
                                <span className="day">Sat</span>
                            </div>
                            <div className="item">
                                <span>61%</span>
                                <ProgressBar value={61} showValue={false}></ProgressBar>
                                <span className="day">Sun</span>
                            </div>
                            <div className="item success">
                                <span>100%</span>
                                <ProgressBar value={100} showValue={false}></ProgressBar>
                                <span className="day">Mon</span>
                            </div>
                            <div className="item">
                                <span>70%</span>
                                <ProgressBar value={70} showValue={false}></ProgressBar>
                                <span className="day">Tue</span>
                            </div>
                            <div className="item today">
                                <span>22%</span>
                                <ProgressBar value={22} showValue={false}></ProgressBar>
                                <span className="day">Today</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 widget-customer-carousel">
                    <h6>Top customers</h6>
                    <Carousel value={customerCarousel} numVisible={4} numScroll={1} responsiveOptions={carouselResponsiveOptions} circular itemTemplate={itemTemplate} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
