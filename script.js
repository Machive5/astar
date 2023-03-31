const panel = document.querySelector('.panel');
let check = false;
let count = 200;
let row,col;
let click = new Array([],[]);
let graph = [];

class components{
    constructor(){
        this.blocked = false;
        this.g = -1;
        this.h = -1;
        this.f = -1;
        this.parentI = -1;
        this.parentJ = -1;
    }
}

//mechanic of the website this function is actualy the mechanic of the each square

document.getElementById('blockRoute').addEventListener('click', ()=>{
    check ? check = false : check = true;
});
document.getElementById('delay').addEventListener('keyup', ()=>{
    count = parseInt(parseFloat(document.getElementById('delay').value) * 1000);
})

function draw(col,row){
    const newElm = document.createElement('div');
    newElm.setAttribute('class',`box ${col}-${row}`);
    newElm.style.top = `max(${(row+0.5)*3}vw,${(row+0.5)*22}px)`;
    newElm.style.left = `max(${(col+0.5)*3}vw,${(col+0.5)*22}px)`;
    newElm.addEventListener('click', ()=>{
        if (check == true){
            graph[col][row].blocked = true;
            newElm.style.backgroundColor = 'rgb(54, 53, 53)';
            newElm.style.border = '0.2vw solid rgb(0, 141, 141)';
        }
        else{
            click.push(new Array(col,row));
            click.shift();
            newElm.style.backgroundColor = 'blue';
            newElm.style.borderColor = 'blue';
            if (JSON.stringify(click[0]) == JSON.stringify(click[1]))
            {
                alert('choose another box');
            }
            else{
                if(click[0][0] != undefined){
                    if(graph[click[0][0]][click[0][1]].blocked || graph[click[1][0]][click[1][1]].blocked){
                        alert('choose another box');
                    }
                    else{
                        astarAlgorithm();
                    }
                }
            }
        }
    });
    return newElm;
}

//generating graph and draw the square on the website
function generate()
{
    click = new Array([],[]);
    panel.innerHTML = "";
    graph = [];
    row = parseInt(document.getElementById('row').value);
    col = parseInt(document.getElementById('col').value);
    
    for (let i=0; i<col; i++){
        let a = [];
        for (let j=0; j<row; j++){
            panel.appendChild(draw(i,j));
            a.push(new components());
        }
        graph.push(a);
    }
}

function reset(){
    const box = document.getElementsByClassName("box");
    click = new Array([],[]);
    for (let i=0; i< box.length; i++)
    {
        if(box[i].style.backgroundColor != 'rgb(54, 53, 53)'){
            box[i].style.backgroundColor = 'cyan';
            box[i].style.borderColor = 'cyan';
        }
    }
}

function turnGreen(i,j){
    document.getElementsByClassName(`box ${i}-${j}`)[0].style.backgroundColor = 'rgb(0, 255, 0)';
    document.getElementsByClassName(`box ${i}-${j}`)[0].style.border = '0.2vw solid rgb(0, 255, 0)'
}
function turnRed(i,j){
    document.getElementsByClassName(`box ${i}-${j}`)[0].style.backgroundColor = 'rgb(255, 17, 0)';
    document.getElementsByClassName(`box ${i}-${j}`)[0].style.border = '0.2vw solid rgb(255, 17, 0)'
}
function turnWhite(i,j){
    document.getElementsByClassName(`box ${i}-${j}`)[0].style.backgroundColor = 'white';
    document.getElementsByClassName(`box ${i}-${j}`)[0].style.border = '0.2vw solid white'
}


//the A* algorithm
function astarAlgorithm()
{
    let start = click[0];
    let end = click[1];
    let openList = []; // displayed as green square
    let closedPath = []; // displayed as red square
    let path = []; // displayed as white square
    
    openList.push(start);
    
    function tracepath(i, j){ //to note the path
        //from the end node, look to it's parrent then add it to the path
        path.unshift(new Array(i,j));
        turnWhite(i,j);
        if(graph[i][j].parentI < 0 && graph[i][j].parentJ < 0){
            return;
        }
        tracepath(graph[i][j].parentI,graph[i][j].parentJ);
    }

    function direction(pi,pj,i,j,s){ // looking the all the 8 direction of each node
        let f,g,h
        if(i < 0 || i > col-1 || j < 0 || j > row-1){ //if not out of range
            return; //ignore
        }
        else if (graph[i][j].blocked == true){ // if not blocked
            return;
        }
        else if (closedPath.find( a => {return a[0] == i && a[1] == j;}) != undefined){ //if in the closedPath 
            return;
        }

        //calculating the distance from the current node to start node (g), current node to end node (h), and the f = g+h
        g = graph[pi][pj].g + s;
        h = Math.floor(Math.sqrt(Math.pow(i-end[0],2) + Math.pow(j-end[1],2)));
        f = g + h;

        if (end[0] == i && end[1] == j){ // if it's end node then generate the path
            graph[i][j].f = f;
            graph[i][j].g = g;
            graph[i][j].h = h;
            graph[i][j].parentI = pi;
            graph[i][j].parentJ = pj;
            turnRed(i,j);

            tracepath(i,j);
            return;
        }
        
        //if it's in the openList then update it if the node on the open list have f more than current node's f
        else if (openList.find((a)=> {return a[0] == i && a[1] == j}) != undefined ){
            if (graph[i][j].f > f && graph[i][j].f >= 0)
            {
                graph[i][j].f = f;
                graph[i][j].g = g;
                graph[i][j].h = h;
                graph[i][j].parentI = pi;
                graph[i][j].parentJ = pj;
                return;
            }
        }

        //if not in openList then add it;
        else{
            graph[i][j].f = f;
            graph[i][j].g = g;
            graph[i][j].h = h;
            graph[i][j].parentI = pi;
            graph[i][j].parentJ = pj;

            openList.push(new Array(i,j));
            turnGreen(i,j);
            return;
        }
    }

    const delay = setInterval(repeat, count);

    function repeat(){
        //choose a node from the openList with the smallest f and add it to the closedPath and delete it from openList
        let i = openList[0][0];
        let j = openList[0][1];
        closedPath.push(openList[0]); //the openList and clossedPath only store the index of the node.
        openList.shift();
        turnRed(i,j);

        //to defining the 8 directions
        direction(i, j, i-1, j,1);
        direction(i, j, i+1, j,1);
        direction(i, j, i, j-1,1);
        direction(i, j, i, j+1,1);
        direction(i, j, i-1, j+1,1.5);
        direction(i, j, i-1, j-1,1.5);
        direction(i, j, i+1, j+1,1.5);
        direction(i, j, i+1, j-1,1.5);

        openList.sort((a,b)=>{ //to sort open list so it will always smallest f point in the begining
            return graph[a[0]][a[1]].f - graph[b[0]][b[1]].f;
        });

        if (path.length > 0){ //if path is complete then stop it
            clearInterval(delay);
            return;
        }

        if (openList.length > 0){ //if no then loop again
            return;
        }

        clearInterval(delay); //if there is no path
        alert('there is no route to the destination');
    }
}

