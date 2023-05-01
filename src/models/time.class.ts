export class Times{

    Weekdays = ['Sunnday','Monday','Thuesday','Wednesday','Thursday','Friday', 'Saturday']

    public getTime(timestamp: number){
        let date  = new Date(timestamp);
        const min = ('0'+ date.getMinutes()).slice(-2);
        let time = date.getHours() +":"+ min + " Uhr";
        return time
    }

    public getDate(timestamp: number){
        let date  = new Date(timestamp);
        return this.Weekdays[date.getDay()] +", "+ date.getDay() +"."+ date.getMonth()
    }

    public isToday(timestamp: number){
        const dateMidnight  = new Date(timestamp).setHours(0,0,0,0);
        return timestamp > dateMidnight;
    }
    

}