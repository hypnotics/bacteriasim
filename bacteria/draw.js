function drawCircle(){
    canvas = document.querySelector("canvas")
    context = canvas.getContext("2d")
    context.beginPath();
    context.fillStyle = '#eeeeee';
    context.arc(250, 250, 200, 0, 2 * Math.PI);
    context.fill();
}

function plotBacteria(b){
    canvas = document.querySelector("canvas")
    context = canvas.getContext("2d")

    context.beginPath();
 
    // Gram staining
    if (b.gram){
        context.fillStyle = 'purple';
    }else{
        context.fillStyle = '#ff69b4';
    }
    
    // Shapes
    if (b.shape === "bacillus"){
        context.ellipse(b.position.x, b.position.y, 4, 10, 45 * Math.PI/180, 0, 2 * Math.PI);
    } 
    if (b.shape === "coccus") {
        context.arc(b.position.x, b.position.y, 9, 0, 2 * Math.PI);
    }

    context.fill();

}