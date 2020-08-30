const video=document.getElementById("video")
let predictedAges=[]
Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
faceapi.nets.faceRecognition.loadFromUri("/models"),
faceapi.nets.faceExpressionNet.loadFromUri("/models"),
faceapi.nets.ageGenderNet.loadFromUri("/models")
]).then(startvideo)
function startvideo()
{
    navigator.getUserMedia({video:{}},stream =>(video.srcObject=stream),
    err=>console.error(err))
}
video.addEventListener("playing",()=> {
    const cannvas=faceapi.createCanvasFromMedia(video);
    document.body.append(cannvas);
    const displaySize={width: video.width,height:video.height};
    faceapi.matchDimensions(cannvas,displaySize);
    setInterval(async()=>{
        const detections=await faceapi
        .detectAllFaces(video,new faceapi.tinyFaceDetector()).
        withFaceLandmarks().withFaceExpressions().withAgeAndGender();
        const resizedDetections=faceapi.resizeResults(detections,displaySize);
        cannvas.getContext("2d").clearRect(0,0,cannvas.width.cannvas.height);
        faceapi.draw.drawDetections(cannvas,resizedDetections);
        faceapi.draw.drawFaceLandmarks(cannvas,resizedDetections);
        faceapi.draw.drawFaceExpressions(cannvas,resizedDetections);
        const age=resizedDetections[0].age;
        const interpolatedAge=interpolatedAgePredictions(age);
        const bottomRight={
            x:resizedDetections[0].detection.box.bottomRight.x-50,
            y:resizedDetections[0].detection.box.bottomRight.y
        };

        new faceapi.draw.DrawTextFields(
            [`${faceapi.utils.round(interpolatedAge, 0)} years`],
            bottomRight).draw(canvas);
    

    },100);

});

function interpolatedAgePredictions(age){
    predictedAges=[age].concat(predictedAges).slice(0,30);
    const avgPredictedAge=predictedAges.reduce((total,a)=>total +a/predictedAges.length);
    return avgPredictedAge;
}








