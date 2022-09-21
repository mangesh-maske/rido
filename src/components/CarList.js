const CarList = ({duration,distance}) => {
    
    const cars = [
        {
            carType:'Micro',
            baseFare:36.77,
            minimumFare:53.93,
            perMinute:0.85,
            perKilometer:9.63,
            delay:120,
            icon:'././assets/images/micro.svg'
        },
        {
            carType:'Hackback',
            baseFare:40.54,
            minimumFare:66.36,
            perMinute:0.96,
            perKilometer:14.98,
            delay:60,
            icon:'././assets/images/hackback.svg'
        },
        {
            carType:'Sedan',
            baseFare:46.20,
            minimumFare:84.80,
            perMinute:1.23,
            perKilometer:12.87,
            delay:180,
            icon:'././assets/images/sedan.svg'
        },
        {
            carType:'Rido Prime',
            baseFare:55.44,
            minimumFare:101.76,
            perMinute:1.48,
            perKilometer:15.44,
            delay:60,
            icon:'././assets/images/sedan.svg'
        },
        {
            carType:'SUV',
            baseFare:78.88,
            minimumFare:150.53,
            perMinute:1.65,
            perKilometer:14.93,
            delay:120,
            icon:'././assets/images/suv.svg'
        },
        {
            carType:'Rido XL',
            baseFare:45.40,
            minimumFare:248.90,
            perMinute:0.84,
            perKilometer:20.80,
            delay:180,
            icon:'././assets/images/xl.svg'
        },
        {
            carType:'Luxury',
            baseFare:50.00,
            minimumFare:415.00,
            perMinute:1.00,
            perKilometer:24.70,
            delay:30,
            icon:'././assets/images/luxury.svg'
        }
    ]
    
    const distanceInKm = distance / 1000;
    const INTEGER_FORMATTER = new Intl.NumberFormat('en-IN',{ style: 'currency', currency: 'INR', maximumFractionDigits:2})

    const calculateDropOffTime = (duration,delay) => {
        const millisecondsToAdd = (duration + delay) * 1000;
        let currentDate = new Date();
        let date = new Date(currentDate.getTime() + millisecondsToAdd);
        let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        let am_pm = date.getHours() >= 12 ? "PM" : "AM";
        let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return hours + ":" + minutes + " " + am_pm;
    }

    const carsList = cars.map((car) => {
        /* const dropOffTime = t.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"); */
        const dropOffTime = calculateDropOffTime(duration,car.delay);
        let totalfare = 0;
        const timeInMinute = (duration + car.delay) / 60;
        const costPerKm = car.perKilometer * distanceInKm;
        const costPerMinute = car.perMinute * timeInMinute;
        
        if(car.minimumFare > costPerKm){
            totalfare = car.baseFare + costPerMinute + car.minimumFare;
        }else{
            totalfare = car.baseFare + costPerMinute + costPerKm;
        }

        // hike the fare price by 60% at night
        const timeOfDay = new Date().getHours();
        if(timeOfDay >= 18 && timeOfDay <= 23){
            totalfare = totalfare + ((parseInt(totalfare) * 60 ) / 100);
        }
        
        return(
            <li key={car.carType}>
                <img src={car.icon} alt={car.carType} />
                <div className='ride-info'>
                    <h5>{car.carType}</h5>
                    <p className='time-distance-info'><span>{parseFloat(distanceInKm).toFixed(1)} Km.</span><span>{dropOffTime} drop off</span></p>
                </div>
                <p className='price'>{INTEGER_FORMATTER.format(totalfare)}</p>
            </li>
        ) 
    })

    return(
        <div className='rider-list-wrapper'>
            <div className='message'>
                <p>Available Ride Options</p>
            </div>
            
            <ul className='riders-list'>
                {carsList}
            </ul>
        </div>
    )
}

export default CarList;