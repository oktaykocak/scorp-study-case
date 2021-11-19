
function repeat(){
    eat();
    coffeeloader();
    if(isWeekIn()){
        code();
        sleep();
    } else {
        drink();
        blackout();
    }
    repeat();
}