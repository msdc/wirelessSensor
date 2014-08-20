var astarModule=require("./astar.js")();


exports.findPath=function(graphMatrix,startNode,endNode){
//    var tpGrid=[
//        [1,1,1,1],
//        [0,1,1,0],
//        [0,0,1,1]
//    ];
    var astar=astarModule.astar;
    var gp= new astarModule.Graph(graphMatrix);
    var startNode=gp.grid[startNode.x][startNode.y];
    var endNode=gp.grid[endNode.x][endNode.y];
    return astar.search(gp,startNode,endNode);
    //return astar.search(graphNodes,startNode,endNode);
}