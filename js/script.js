/*
Panels with images are somewhat jerky when all panels are transitioning. Ideas on improvements are welcome in the comments!
*/
var btn = $('button');
var body = $("body");

btn.on("click", function () {
    body.toggleClass("hide-images");
});