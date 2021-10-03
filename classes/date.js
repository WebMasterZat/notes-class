class DateClass {
    constructor(){
        moment.lang('ru');
    }
    static formatData(timestamp, format) {
        return moment(timestamp).format(format)
    }
}

