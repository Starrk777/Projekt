var sort,sortup,scroll,pos;

(function()
{
    var app=angular.module('site', ['ngRoute']);
    app.controller('MainMenu',function($scope)
    {
        this.list = WPN;

        this.tab = -1;
        this.stab = -1;
        this.focus = function(nr){ this.stab = -1; this.tab = nr; };
        this.focused = function(nr){ return this.tab === nr; };
        this.sfocus = function(nr){ this.stab = nr;}
        this.sfocused = function(nr){ return this.stab === nr; };

        //$scope.go = function(path) { $location.path(path); };

    });
    app.config(function($routeProvider)
    {
        $routeProvider
            .when('/home',{ templateUrl: 'pages/home.html', controller: 'modelctrl'})
            .when('/M4', { templateUrl: 'pages/M4.html', controller: 'modelctrl'})
            .when('/G36',{ templateUrl: 'pages/G36.html', controller: 'modelctrl'})
            .when('/SVD',{ templateUrl: 'pages/SVD.html', controller: 'modelctrl'})
            .when('/SKS',{ templateUrl: 'pages/SKS.html', controller: 'modelctrl'})
            .when('/Beretta',{ templateUrl: 'pages/Beretta.html', controller: 'modelctrl'})
            .when('/Glock 17',{ templateUrl: 'pages/Glock 17.html', controller: 'modelctrl'})
            .when('/Ranking',{ templateUrl: 'pages/rank.html', controller: 'comparsionctrl'})
            .otherwise({ redirectTo: '/home'});
    });

    app.controller('modelctrl',function($scope)
    {
        function LeftScrl()
        {
            SetScrl($('#gallery').scrollLeft()-10);
            if(scroll) setTimeout(LeftScrl,10);
        }
        function RightScrl()
        {
            SetScrl($('#gallery').scrollLeft()+10);
            if(scroll) setTimeout(RightScrl,10);
        }
        function SetScrl(dest)
        {
            $('#gallery').scrollLeft(dest);
            var divs = $('#gallery>div'), scrw = $('#gallery').width();
            $.each(divs,function(n,d)
            {
                if(0<=$(d).position().left+$(d).width() && $(d).position().left<=scrw)
                { if($(d).css('background-image')=='none') $(d).css('background-image','url("pages/'+$(d).text()+'")');}
                else if($(d).css('background-image')!='none') $(d).css('background-image','none');
            });
        }

        $scope.load = function()
        {
            pos=0;
            var G = $('#gallery');
            if($(G).length<1) return;

            $(G).before('<div class="left_g_btn"></div>').after('<div class="right_g_btn"></div>');
            var x=0;
            $.each($(G).children('div'),function(n,el)
            {
                $(el).css('left',(x++)*256);
                $(el).css('background-image','none');
                //$(el).text('');
            });
            $(G).prev().on('mousedown',function(){ scroll=true; LeftScrl(); }).on('mouseup',function(){ scroll = false; });
            $(G).next().on('mousedown',function(){ scroll=true; RightScrl(); }).on('mouseup',function(){ scroll = false; });
            SetScrl(0);
        };
        $scope.load();
    });




    app.controller('comparsionctrl',function($scope)
    {
        sort = 0; sortup=false;
        $scope.load = function()
        {
            $.get("pages/list.txt", function(data)
            {
                var types = ['Nazwa','Rodzaj','Panstwo','Producent','Kaliber','Magazynek','Masa'];
                var list=[];
                // 1 - separacja danych
                data=data.split('\n\n');
                $.each(data,function(nr,wpn)
                {
                    var param = wpn.split('\n'); list[nr]={};
                    $.each(param,function(n,p){ if(p=='') return; p=p.split(': ');  list[nr][p[0]]=p[1]; });// $(CT).append('<div>'+v+'</div>'); }); });
                });
                // 2 - Tworzymy tabele
                var s='<tr>';
                $.each(types,function(n,t){ s +='<td class="DontSort"></td>'; });
                $("#ComparsionTable").append(s+'</tr>');
                var s='<tr>';
                $.each(types,function(n,t){ s +='<td><b>'+t+'<b></td>'; });
                $("#ComparsionTable").append(s+'</tr>');

                $.each(list,function(nr,wpn)
                {
                    s='<tr>';
                    $.each(types,function(n,t){ s+='<td>'+wpn[t]+'</td>'; });
                    $("#ComparsionTable").append(s+'</tr>');
                });
                // 3 - Nadawanie eventów
                $(".DontSort").on("click",function()
                {
                    var trlist = $("#ComparsionTable>tr");
                    if(sort==$(this).prevAll().length)//sortujemy po tym samym
                    {
                        sortup = !sortup;
                        if(sortup) $(this).removeClass('SortDown').addClass('SortUp');
                              else $(this).addClass('SortDown').removeClass('SortUp');
                    }
                    else
                    {
                        sortup = false;
                        $(trlist).eq(0).children("td").eq(sort).removeClass('SortDown').removeClass('SortUp').addClass('DontSort');
                        sort = $(this).prevAll().length;
                        $(this).removeClass('DontSort').addClass('SortDown');
                    }
                    //mechanizm porownywania
                    trlist = $("#ComparsionTable>tr:gt(1)");
                    var getchld = function(n){ return $(trlist).eq(n).children("td").eq(sort); };
                    if(sortup)
                    {
                        for(var a=1; a<$(trlist).length; a++)
                            if(getchld(a-1).text()>getchld(a).text())
                                { $(trlist).eq(a).after($(trlist).eq(a-1)); a-=2; if(a<0) a=0; trlist=$("#ComparsionTable>tr:gt(1)"); }
                    }
                    else for(var a=1; a<$(trlist).length; a++)
                            if(getchld(a).text()>getchld(a-1).text())
                                {$(trlist).eq(a-1).before($(trlist).eq(a)); a-=2; if(a<0) a=0; trlist=$("#ComparsionTable>tr:gt(1)"); }
                });
            });
        };
        $scope.load();
    });

    var WPN =
    [
        { title:"Home", list:[ "Główna","Ranking" ] },
        { title:"5,56", list:["M4", "G36"] },
        { title:"7,62", list:["SVD", "SKS"] },
        { title:"9mm", list:[ "Glock 17", "Beretta" ] }
    ];
})();
