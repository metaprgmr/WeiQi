function w(){for(var i in arguments)document.write(arguments[i])}
function writeLine(ln, prefix, showLM2, showSamples, demoLines) {
  if (prefix) w(prefix);
  var active = false;
  for (var i=0; i<ln.length; ++i) {
    var c = ln[i];
    if (active) {
      switch (c) {
      case ' ': w(' '); break;
      case '*': w('<sta>', c, '</sta>'); break;
      case '@': if (demoLines) w('<ln>+</ln>'); else w('+'); break;
      case '&': if (demoLines) { w('<ln>', showLM2?'<lm2>#</lm2>':'+', '</ln>'); break; } // else, do the next
      case '#':
      case '^':
      case '<':
      case '>':
      case 'v': if (showLM2) w('<lm2>', c, '</lm2>'); else w('+'); break;
      case '|': w('</bd>'); active = false; break;
      default:
        if (' ABCDESWNO'.indexOf(c) > 0)
          w('<lm1>', c, '</lm1>');
        else if (' abcdefghijklmnpqrstuwxyz'.indexOf(c) > 0) {
          if (showSamples) w('<ex>', c, '</ex>'); else w('+');
        }
        else w(c);
        break;
      }
    } else if (c == '|') { w('<bd>'); active = true; }
    else w(c);
  }
  w('\n');
}
function drawBoard(bd, showLM2, showSamples, demoLines) {
  var prefix = '';
  var tbBar ='   1 2 3   5 6   8 9   9 8   6 5   3 2 1';
  w('<pre class="bdfont">', prefix, tbBar, '\n\n');
  var a = bd.split('\n');
  for (var i=0; i<a.length; ++i)
    writeLine(a[i], prefix, showLM2, showSamples, demoLines);
  w('\n', prefix, tbBar, '</pre>');
}

function showGame(gm) {
  w('<pre class="bdfont">');
  var a = gm.split('\n');
  var blacks = ' 13579bdfhjln',
      whites = ' 2468acegikm';
  for (var i in a) {
    var ln = a[i];
    w('<bd>');
    for (var j=0; j<ln.length; ++j) {
      var c = ln[j];
      if (c == '*') w('<sta>*</sta>');
      else {
        if (blacks.indexOf(c) > 0) w('<bla>', c, '</bla>');
        else if (whites.indexOf(c) > 0) w('<whi>', c, '</whi>');
        else w(c);
      }
    }
    w('</bd>\n');
  }
  w('\n</pre>');
}

var board0 =
`1  |+ + + + + + + + + @ + + + + + + + + +|  1
2  |+ + + + + + + + + @ + + + + + + + + +|  2
3  |+ + + + + + + + + @ + + + + + + + + +|  3
   |+ + + B + + # + + N + + # + + C + + +|   
5  |+ + + + + + + + + @ + + + + + + + + +|  5
6  |+ + + + + + + + + @ + + + + + + + + +|  6
   |+ + + # + + # + + & + + # + + # + + +|   
8  |+ + + + + + + + + @ + + + + + + + + +|  8
9  |+ + + + + + + + + @ + + + + + + + + +|  9
   |@ @ @ W @ @ & @ @ O @ @ & @ @ E @ @ @|   
9  |+ + + + + + + + + @ + + + + + + + + +|  9
8  |+ + + + + + + + + @ + + + + + + + + +|  8
   |+ + + # + + # + + & + + # + + # + + +|   
6  |+ + + + + + + + + @ + + + + + + + + +|  6
5  |+ + + + + + + + + @ + + + + + + + + +|  5
   |+ + + A + + # + + S + + # + + D + + +|   
3  |+ + + + + + + + + @ + + + + + + + + +|  3
2  |+ + + + + + + + + @ + + + + + + + + +|  2
1  |+ + + + + + + + + @ + + + + + + + + +|  1`;

var board1 =
`1  |+ + + + + + + + + @ + + + + + + + + +|  1
2  |+ + + + + + + + + @ + + + + + + + + +|  2
3  |+ + + + + + + + + @ + + + i + + k + +|  3
   |+ + + B + f # + + N + + # + + C + + +|   
5  |+ + + + + + + + + @ + + + + + + + + +|  5
6  |+ + + g + h + + + @ + + + + + + + + +|  6
   |+ + + # + + # + + & + + # + + # j + +|   
8  |+ + + + + + + + + @ + + + + + + + + +|  8
9  |+ + + + + + + + + @ + + + + + + + + +|  9
   |@ @ c W @ @ e @ @ O p @ & @ @ E @ @ @|   
9  |+ + + + + + d + + @ + + + + + + + l +|  9
8  |+ + + + + + + + + @ + + + + + + + + +|  8
   |+ + + # + + # + + & + + # + + # + + +|   
6  |+ + + + + + + + + @ + + + + + + + + +|  6
5  |+ b + + + + + + + q + + + + + m + + +|  5
   |+ + + A + + # + + S + + # + n D + + +|   
3  |+ + + + + + + + + @ + + + + + + + + +|  3
2  |+ + a + + + + + + @ + + + + + + + + +|  2
1  |+ + + + + + + + + @ + + + + + + + + +|  1`;

var board2 =
`1  |+ + + + + + + + + + + + + + + + + + +|  1
2  |+ + + + + + + + + + + + + + + + + + +|  2
3  |+ + + ^ + + ^ + + ^ + + ^ + + ^ + + +|  3
   |+ + < B > < # > < N > < # > < C > + +|   
5  |+ + + v + + v + + v + + v + + v + + +|  5
6  |+ + + ^ + + ^ + + ^ + + ^ + + ^ + + +|  6
   |+ + < # > < # > < # > < # > < # > + +|   
8  |+ + + v + + v + + v + + v + + v + + +|  8
9  |+ + + ^ + + ^ + + ^ + + ^ + + ^ + + +|  9
   |+ + < W > < # > < O > < # > < E > + +|   
9  |+ + + v + + v + + v + + v + + v + + +|  9
8  |+ + + ^ + + ^ + + ^ + + ^ + + ^ + + +|  8
   |+ + < # > < # > < # > < # > < # > + +|   
6  |+ + + v + + v + + v + + v + + v + + +|  6
5  |+ + + ^ + + ^ + + ^ + + ^ + + ^ + + +|  5
   |+ + < A > < # > < S > < # > < D > + +|   
3  |+ + + v + + v + + v + + v + + v + + +|  3
2  |+ + + + + + + + + + + + + + + + + + +|  2
1  |+ + + + + + + + + + + + + + + + + + +|  1`;

