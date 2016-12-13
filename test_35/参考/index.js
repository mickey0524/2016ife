(function () {
  var WIDTH = 42;
  var HEIGHT = 42;
  var btn = document.getElementById('btn');
  var userIn = document.getElementById('userIn');
  var clearBtn = document.getElementById('reFresh');
  var controller = (function () {
    function mkMaze (container, config) {
      var x = config.x;
      var y = config.y;
      var i, j;
      var el = document.createDocumentFragment();
      var arr = [];
      for (i = 0;i < x;i++) {
        for (j = 0;j < y;j++) {
          el.appendChild(_createDiv({
            x: x,
            y: y,
            i: i,
            j: j
          }));
        }
      }
      container.style.width = config.y * WIDTH + config.y - 1 + 'px';
      container.appendChild(el);
      return _mkAction(container, config);
    }
    function _createDiv (obj) {
      var oDiv = document.createElement('div');
      oDiv.className = 'maze-block';
      if (obj.j === 0 && obj.i !== 0) {
        oDiv.style.clear = 'both';
      } 
      if (obj.i === obj.x - 1) {
        oDiv.className += ' bottom-maze-block';
      }
      if (obj.j === obj.y - 1) {
        oDiv.className += ' right-maze-block';
      }
      return oDiv;
    }
    function _mkAction (container, obj) {
      var ox = Math.floor(Math.random() * obj.x + 0);
      var oy = Math.floor(Math.random() * obj.y + 0);
      var action = _createAction(ox, oy);
      container.appendChild(action);
      return {
        x: ox,
        y: oy,
        action: action,
        turn: 0,
        rotate: 0
      }
    }
    function _createAction (ox, oy) {
      var oAction = document.createElement('div');
      oAction.className = 'Action';
      oAction.style.position = 'absolute';
      oAction.style.left = oy * (WIDTH + 1) + 'px';
      oAction.style.top = ox * (HEIGHT + 1) + 'px';
      return oAction;
    }

    return (function () {
      var pos = mkMaze(document.getElementById('container'), {
        x: 10,
        y: 10,
      });
      function move (force, num) {
        var turn = force || pos.turn;
        if (num === 0) {
          return;
        }
        if (turn === 0) {
          pos.x > 0 && pos.x--;
        } else if (turn === 1) {
           pos.y < 9 && pos.y++;
        } else if (turn === 2) {
           pos.x < 9 && pos.x++;
        } else if (turn === 3) {
           pos.y > 0 && pos.y--;
        }
        pos.action.style.left = pos.y * (WIDTH + 1) + 'px';
        pos.action.style.top = pos.x * (HEIGHT + 1) + 'px';
        num && move(force, num - 1);
      }
      function turn (type, rotate) {
        if (rotate === undefined) {
          if (type === 1) {
            pos.rotate -= 90;
          } else if (type === 2) {
            pos.rotate += 90;
          } else if (type === 3) {
            pos.rotate += 180;
          }
          if (pos.rotate >= 360) {
            pos.rotate -= 360;
          }
          if (pos.rotate <= - 360) {
            pos.rotate += 360;
          }   
        } else {
          pos.rotate = rotate;
        }
       if (pos.rotate >= 0) {
          pos.turn = pos.rotate / 90;
        } else {
          pos.turn = 4 + pos.rotate / 90;
        }
        pos.action.style.transform = 'rotate(' + pos.rotate +  'deg)';
      }
      return {
        move: move,
        turn: turn
      };
    }());
  }());

  var handler = {
    'GO': function (num) {
      controller.move(null, num);
    },
    'TUN LEF': function () {
      controller.turn(1);
    },
    'TUN RIG': function () {
      controller.turn(2);
    },
    'TRA LEF': function (num) {
      controller.move(3, num);
    },
    'TRA TOP': function (num) {
      controller.move(0, num);
    },
    'TRA RIG': function (num) {
      controller.move(1, num);
    },
    'TRA BOT': function (num) {
      controller.move(2, num);
    },
    'TUN BAC': function () {
      controller.turn(3);
    },
    'MOV LEF': function (num) {
      controller.turn(null, 270);
      controller.move(null, num);
    },
    'MOV TOP': function (num) {
      controller.turn(null, 0);
      controller.move(null, num);
    },
    'MOV RIG': function (num) {
      controller.turn(null, 90);
      controller.move(null, num);
    },
    'MOV BOT': function (num) {
      controller.turn(null, 180);
      controller.move(null, num);
    }
  }
  var handlTextArea = (function () {
    var matchEnterExp = /\r|\n/g;
    var matchConsoleExp = /\n/g;
    var row = 0;
    var textArea = document.getElementById('userIn');
    var rowList = document.getElementById('show-row');

    function _addRow (enterNum) {
      if (row !== enterNum) {
        var el;
        var temp = document.createDocumentFragment();
        rowList.innerHTML = '';
        for (var i = 0;i <= enterNum;i++) {
          el = document.createElement('div');
          el.className = 'row-el';
          el.innerHTML = i;
          temp.appendChild(el);
        }
        rowList.appendChild(temp);
        row = enterNum;
      }
    }
    return {
      matchEnter: function () {
        var value = textArea.value;
        var enterNum = value.match(matchEnterExp) && value.match(matchEnterExp).length;
        _addRow(enterNum);
      },
      matchConsole: function () {
        var value = textArea.value;
        var consoleArr = value.split(matchConsoleExp);
        console.log(consoleArr);
        return consoleArr;
      },
      scrollList: function (scrollTop) {
        rowList.scrollTop = scrollTop;
      }
    }
  }());
  var execConsole = (function () {
    var spExp = /MOV|TRA|GO/;
    var rowList = document.getElementById('show-row');
    var consoleExp = '';
    var timer;
    for (var key in handler) {
      if (spExp.test(key)) {
        consoleExp += '^' + key + '(\\s+[0-9]+)?$|';
      } else {
        consoleExp += '^' + key + '$|';
      }
    }
    consoleExp = consoleExp.slice(0,-1);
    consoleExp = new RegExp(consoleExp);
    console.log(consoleExp);
    function _jud (arr) {
      return arr && arr.map(function (item, index) {
        item = item.replace(/^\s+|\s+$/g, '');
        if (consoleExp.test(item)) {
          return item;
        } else {
          return false;
        }
      });
    }
    return {
      exec: function () {
        var consoleArr = _jud(handlTextArea.matchConsole());
        var i = 0;
        var fn = handler[consoleArr[i].replace(/\s+[0-9]+\s*$/, '')];
        var num = consoleArr[i].match(/[0-9]+/) && consoleArr[i].match(/[0-9]+/)[0];
        i++;;
        fn(num);
        timer = setInterval(function () {
          if (i >= consoleArr.length) {
            clearInterval(timer);
            return;
          }
          fn = handler[consoleArr[i].replace(/\s+[0-9]+\s*$/, '')];
          num = consoleArr[i].match(/[0-9]+/) && consoleArr[i].match(/[0-9]+/)[0];
          fn && fn(num);
          i++;
        }, 1000);
      },
      check: function () {
        var checkArr = _jud(handlTextArea.matchConsole());
        var flag = true;
        checkArr && checkArr.forEach(function (item, index) {
          if (!item) {
            rowList.children[index] && (rowList.children[index].style.background = 'red');
            flag = false;
          } else {
            rowList.children[index] && (rowList.children[index].style.background = '');
          }
        })
        return flag;
      }
    }
  }());
  var textTimer = setInterval(function () {
    handlTextArea.matchEnter();
  },500);
  btn.addEventListener('click', function () {
    var flag = execConsole.check();
    flag && execConsole.exec();
  });
  userIn.addEventListener('scroll', function () {
    handlTextArea.scrollList(this.scrollTop);
  });
  clearBtn.addEventListener('click', function () {
    userIn.value = '';
  });
}());