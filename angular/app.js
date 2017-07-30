//Declare the module\
var app=angular.module('footballApp',['ngRoute']);

//Declare service for lists for the two json files
app.service('detailService', function() {
    var matchdetail="";
    var list1={id:1};
    var list2={id:2};
    var list={};
    var bg=0;
    return {list1:list1,
    list2:list2,
  list:list,
  bg:bg};

});

//Declare the main controller and use detailService
app.controller('mainController',['detailService',function(detailService){

  this.value=false;
  var m=this;
  m.bg=detailService.bg;

  //Set background image in index-view
  m.setback=function(bg){
    detailService.bg=bg;

  }

//Identify if touch device and set grayscale if not
  if(is_touch_device())
  {

  }
  else {
          $(".first").mouseover(function() {
            $(this).css('-webkit-filter', 'none');
        }).mouseout(function() {
            $(this).css('-webkit-filter','grayscale(100%)');
        });
        $(".second").mouseover(function() {
          $(this).css('-webkit-filter', 'none');
      }).mouseout(function() {
          $(this).css('-webkit-filter','grayscale(100%)');
      });
  }
  function is_touch_device() {
    return 'ontouchstart' in window        // works on most browsers
        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };


  //Update current list according to ng-click
  m.setList=function(id){
          if(id===1)
            detailService.list=detailService.list1;
          else
            detailService.list=detailService.list2;
          console.log(detailService.list);
        };
      this.jumboHide=function(){
      m.value=true;
      };
}]);


//Declare the matches controller
app.controller('matchesController',['$scope','$http','$location','detailService',function($scope,$http,$location,detailService){
  var m=this;

  m.list={};

//First http request
  var url='https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json';
    $http.get(url).then(function(data){
    //Set current list
    if(detailService.list===detailService.list1)
    {
      detailService.list=data;
      m.list=data;
      m.bg=detailService.bg;
      console.log(m.bg);
      setTeams();
      addYearandMatchday();
      detailService.list1=data;

      console.log(m.list);
    }
    console.log(m.list);
    },function(data){
        console.log("error");
    });

  //Second http request
  url='https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json';
    $http.get(url).then(function(data){
      //Set current list
      if(detailService.list===detailService.list2)
      {
        detailService.list=data;
          m.list=data;
          m.bg=detailService.bg;
          console.log(m.bg);
        setTeams();
        addYearandMatchday();
        detailService.list2=data;

        console.log("works2");
      }

  },function(data){
  console.log("error");
  });

  //Add separate fields for year and matchday calculated from given data
   function addYearandMatchday(){
    for(i in m.list.data.rounds)
      for(j in m.list.data.rounds[i].matches)
      {
      m.list.data.rounds[i].matches[j].abc=findYear(m.list.data.rounds[i].matches[j].date);
      m.list.data.rounds[i].matches[j].goals=findGoals(m.list.data.rounds[i].matches[j].score1,m.list.data.rounds[i].matches[j].score2);
      m.list.data.rounds[i].matches[j].matchday="Matchday"+i;
      }
      console.log(m.list);
  }

    function findYear(d){
       console.log("year working");
       return d.substring(0,4);
     }
   function findGoals(s1,s2){
     if(s1+s2===0)
     return '0 goals';
     if(s1+s2>0&&s1+s2<4)
     return '3 goals';
     if(s1+s2>3&&s1+s2<7)
     return '6 goals';
     if(s1+s2>6)
     return '>6 goals'
   }

   //Copy list items from service to controller list
  m.setList=function(id){
        if(id===1)
          m.list=detailService.list1;
        else
          m.list=detailService.list2;
          console.log(m.list);
      };
  m.teams=[];
  //Create teams array in m.teams
   function setTeams(){
        var i=0;
        console.time("runs");
        while(detailService.list.data.rounds[0].matches[i])
        {
          m.teams.push(
            detailService.list.data.rounds[0].matches[i].team1.name
          );
            m.teams.push(
              detailService.list.data.rounds[0].matches[i].team2.name
            );
            i++;
        }
        console.timeEnd("runs");
          console.log(m.teams.sort());
      }
    m.team="";
    m.id=0;
    m.item="";

    //Check the filter
    m.selected=function(id){
      m.item="";
      m.id=id;
    }

    //Check the filter entry
    m.filterItem=function(item,id){
      if(id==1)
      {
      m.item=item.substring(0,4);
    console.log(m.item);
    }
      else
      {
        if(id==4)
        {
          m.item="Matchday"+item;
        }
        else
    m.item=item;
    }
    }



    //For the detail page
    this.showDetail=function(obj){
        detailService.matchdetail=obj;
        $location.path("/match-detail-view");

      }

}]);


//Declare the detail matches controller
app.controller('detailController',['detailService',function(detailService){
    var m=this;
    m.match=detailService.matchdetail;
    m.bg=detailService.bg;
    m.review="";

    //Custom comments on a match
    if(m.match.score1>m.match.score2)
    {
      m.review="In the latest installment between "+m.match.team1.name+" and "+m.match.team2.name+" , "+m.match.team1.name+" won the game by "+m.match.score1+"-"+m.match.score2+". It was a great team effort by "+m.match.team1.name+" who showed their quality in the final third. "+m.match.team2.name+" need to improved and bounce back in the next round of matches.";
    }
    if(m.match.score1<m.match.score2)
    {
      m.review="In the latest installment between "+m.match.team1.name+" and "+m.match.team2.name+" , "+m.match.team2.name+" won the game by "+m.match.score1+"-"+m.match.score2+". It was a great team effort by "+m.match.team2.name+" who showed their quality in the final third. "+m.match.team1.name+" need to improved and bounce back in the next round of matches.";
    }
    if(m.match.score1==m.match.score2)
    {
      m.review="In the latest installment between "+m.match.team1.name+" and "+m.match.team2.name+" , "+m.match.team1.name+" and "+m.match.team2.name+" game ended with a "+m.match.score1+"-"+m.match.score2+" draw. Both teams need to be clinical ahead of the next round because these were valuable points dropped."
    }
}]);

//Declare the table controller
app.controller('tableController',['detailService',function(detailService){
  var m=this;
  m.teams=[];
  m.bg=detailService.bg;

  //Create custom list containing all points and stats
  for (i in detailService.list.data.rounds[0].matches)
  {
    m.teams.push({
      name:detailService.list.data.rounds[0].matches[i].team1.name,
      points:0,
      won:0,
      lost:0,
      draw:0,
      gf:0,
      ga:0,
      gd:0
      });
      m.teams.push({
        name:detailService.list.data.rounds[0].matches[i].team2.name,
        points:0,
        won:0,
        lost:0,
        draw:0,
        gf:0,
        ga:0,
        gd:0
        });
  }
    m.obj=detailService.list.data;


    //Update the above list according to the results
    for(i in m.obj.rounds)
      for(j in m.obj.rounds[i].matches)
      {
        if(m.obj.rounds[i].matches[j].score1>m.obj.rounds[i].matches[j].score2)
        {
          for(k in m.teams)
            {
                if(m.obj.rounds[i].matches[j].team1.name==m.teams[k].name)
                {
                    m.teams[k].points=m.teams[k].points+3;
                    m.teams[k].won=m.teams[k].won+1;
                    m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score1;
                    m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score2;
                    m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
                if(m.obj.rounds[i].matches[j].team2.name==m.teams[k].name)
                {
                    m.teams[k].lost=m.teams[k].lost+1;
                    m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score2;
                    m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score1;
                    m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
            }
        }
        if(m.obj.rounds[i].matches[j].score2>m.obj.rounds[i].matches[j].score1)
        {
          for(k in m.teams)
            {
                if(m.obj.rounds[i].matches[j].team1.name==m.teams[k].name)
                {
                    m.teams[k].lost=m.teams[k].lost+1;
                    m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score1;
                    m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score2;
                    m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
                if(m.obj.rounds[i].matches[j].team2.name==m.teams[k].name)
                {
                  m.teams[k].points=m.teams[k].points+3;
                  m.teams[k].won=m.teams[k].won+1;
                  m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score2;
                  m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score1;
                  m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
            }
        }
        if(m.obj.rounds[i].matches[j].score2==m.obj.rounds[i].matches[j].score1&&m.obj.rounds[i].matches[j].score1!=null)
        {
          for(k in m.teams)
            {
                if(m.obj.rounds[i].matches[j].team1.name==m.teams[k].name)
                {
                    m.teams[k].draw=m.teams[k].draw+1;
                    m.teams[k].points=m.teams[k].points+1;
                    m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score1;
                    m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score2;
                    m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
                if(m.obj.rounds[i].matches[j].team2.name==m.teams[k].name)
                {
                  m.teams[k].points=m.teams[k].points+1;
                  m.teams[k].draw=m.teams[k].draw+1;
                  m.teams[k].gf=m.teams[k].gf+m.obj.rounds[i].matches[j].score2;
                  m.teams[k].ga=m.teams[k].ga+m.obj.rounds[i].matches[j].score1;
                  m.teams[k].gd=(m.teams[k].gf-m.teams[k].ga);
                }
            }
        }
      }
      console.log(m.teams);
}]);
