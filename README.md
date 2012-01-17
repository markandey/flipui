FLIP UI
=============
FLIP UI is pure html, javascript solution to bring flipboard like UI in iPhone as webpage. 

How to Use?
---------------
Something goes here

<pre><code>
makeflip(&lt;DOM selector&gt;,&lt;width>,&lt;height&gt;,&lt;html array of content&gt;);
</code></pre>

How Code Works?
-----------------
My approach is simple I used basic CSS3 attribute
<pre><code>
-webkit-transform: rotateX(180deg);
-webkit-transition-duration: 2s;

</code></pre>

To achieve complete flip of a page you need to add CSS style of <pre><code>-webkit-transform: rotateX(180deg);</code></pre>
Problem with 180 flip is your HTML content goes upside down, to simulate flipboard like animation you can not flip it complete 180 degrees.

This code flip 90 degree for <i>first half of the flip</i> and back to zero degree for <i>second half of the flip</i>, To fake half page flip it adds mask at the top during the <i>first half of the flip</i> and then, mask moved down for the second half.



Problems on iPhone's Safari
----------------------------
- z-order problem on webkit, with 3D transform
This mask thing could not work properly because In  iPhone's safari when a object is  3D transformed , z-order does not work properly.  I worked around it by making one half of page to transparent.

- Touch Events of iPhone
Touch events on iPhone have some serious problem, i encountered weird problem with event propagation.


READ More 
-----------------
http://www.markandey.com/2011/12/flipboard-like-ui-on-iphone-safari.html

Limitations!
-----------------
 - It flickers sometime
 - Works only on chrome and iPhone

Demo?
----------
You can see working Demo Here http://www.purplegene.com/static/flip3.html

