

export default function calculate(object, type, buttonValue) {

    var total = (object.total == null) ? 0 : object.total;
    var next = object.next;
    var operator = object.operator;
    var needCallApi = false;

    switch (type) {
        case 'operator':
            if(operator == null && next !== null) {
                total = next;
            }
            else if(next != null) {
                needCallApi = true;
            }
            next = null;
            operator = buttonValue;
            break;
        case 'number':
            if(next !== null && next !== '0') {
                next += buttonValue;
            }
            else
                next = buttonValue;
            break;
        case 'equal':
            if(operator != null && next != null) {
                needCallApi = true;
                next = null;
                operator = null;
            }
            break;
        case 'dot':
            if(next == null)
                next = '0.';
            else if(!next.includes('.'))
                next += '.';
            break;
        case 'clear':
        default:
            total = null;
            next = null;
            operator = null;
    }

    return {
        total: total,
        next: next,
        operator: operator,
        needCallApi: needCallApi
    }
}
