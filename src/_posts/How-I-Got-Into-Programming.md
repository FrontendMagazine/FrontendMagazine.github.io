# How I Got Into Programming

# 我是怎么入坑的

Like most people in our field, I’ve always been fascinated with problem-solving. The painful thrill of hunting for a solution, the exhilarating relief of having found a fix — there’s nothing quite like it. When I was younger, I really enjoyed strategy games like Chess, which I played ever since I was a kid; StarCraft, a real-time strategy game I played for ten years straight; or Magic: The Gathering, a trading card game that can be described as the intersection between Poker and Chess. They presented plenty of problem-solving opportunityies.

干我们这一行的人都有一个毛病，就是痴迷于解决问题，我也如此。在寻找解决方案时越是痛苦，在问题获解时就会越爽。没有什么比这还让人兴奋的事了！

## The Early–Early Days

Five years after kindergarten — so that everyone understands the rough timeline, so many school systems! — I made my first forays into programming. Back then I had a Computer class. Pretty much everyone was thrilled about it because, back then, Computer class just meant listening to music and chatting for half an hour. To me, Computer class was fun because I got to learn about Pascal, Flash animation and a tad of ActionScript, and bits of HTML, bgcolor, and the obligatory <marquee> tags.

My first programs weren’t fancy. Back then, making the computer ask me my first name, and then my last name, and then print both out in a single sentence made me experience levels of excitement I can’t even begin to describe. I was in control. Just a few lines of code, and the computer became a relay for my commands.

A while later I experimented with the web. We used FrontPage back then, and we liked it. I must’ve made half a dozen websites around this time. Most of them consisted of bright green Comic Sans text on blue backgrounds. Some had essential Java applets with password prompts, and an admin panel consisting entirely of tic-tac-toe. We used <table> for everything back then. Everything. Tables also often involved some sort of image for the background, but it wasn’t just a single image, it was one for each corner, two for each row (left and right), two for each column (top and bottom), and another one used for every other cell.

Click here for a “banner ad” I made back then.
The web was fun. Ads ran on Flash. Sites ran on Flash. Sites had “intros”, but you could skip those. I never understood why intros needed a “loading” indicator, but I added a fake one – because it was such a fundamental part of the experience.

Experimenting with Flash was also fun. This was probably one of the few times I felt popular back then. During Computer classes. I made a Flash animation of a cow’s face 🐮 that moved a little bit. And if you clicked parts of its face, they would swirl around, make funny sounds, and stuff like that. Really silly in retrospect, but it made me feel popular for a few minutes that day. My classmates liked my silly cow.

## The Early Days

For my last 3 years of high school I went to a school where I could specialize in Computer Systems. By this time I was 16. They taught a bunch of programming languages – VB6, C, Java, Pascal, ASP, little bits of web development – but more importantly things like algorithms and program design.

I cloned Paint using VB6. I had fun cloning things. In order to draw freely with the pencil, at first my Paint just drew a dot whenever it detected a mouse movement. This was really bad not only for performance reasons, but also due to the fact that computers were so slow back then that VB6 didn’t even bother reporting every single mouse move event, so the pencil drawings were more like dotted lines. I started tracking state and then each point when using the pencil was drawn as a line between the last point and the current point. The lines looked pretty smoothly, and I was happy about my discovery. Then I went on and opened the real Paint, started drawing by quickly moving the mouse, and figured out that they did the same as I had done! That was something I loved about my Paint clone. Making it helped me figure out how things worked, which is always a rewarding endeavor.

Then nobody believed I had actually made the Paint clone. They thought I just downloaded it, even when I showed them the really-important “About” page showing I was the author. Deep down, I was proud they didn’t believe I made it.

A while later I made a clone of Snake – the one where you eat dots and your snake grows until it tries to eat itself. That one went to a science fair they had every year at my school. It was fun seeing people try it out. I had made it.

For the last science fair we made a small collaborative project together with the electronics guys. They handed up a micro controller card and the specs. We then took the motor of a ceiling fan, a baby tub, and some other components and made a prototype for a “remote-controlled swimming pool”. I didn’t have much to do with the electronics side, but I made the website. It was just an ASP website that took commands and transmitted them to the micro controller connected to that same computer. We brought two computers to the fair, to demonstrate it was actually remote, but nobody seemed to care. I did, it was my favorite part. Anyways, the site allowed you to open or close a ceiling for the swimming pool. The idea was you could keep the pool closed during rains and open it up on sunny days. The site also tracked – thanks to some sensors connected to the micro controller – the temperature and pH for the pool. You could turn on the heat when the temperature was low, and there was an alert when pH changed considerably. It was a super fun project.

## Ultima Online — C# and a real job™

Ultima Online (UO), a massively multiplayer online role-playing game (no wonder they abbreviate that as MMORPG), wasn’t any different. I played in a local server that turned out to use an open-source implementation of the server written entirely in C#, all the way down to networking packets. The administrators, who had no programming experience, slowly started trusting me to handle minor bug fixes by literally emailing source code files back and forth. I was hooked. C# was a wonderful, expressive language, and the open-source software for the UO server was very amicable and inviting — you didn’t even need an IDE (or even know what that was) because the server would compile script files dynamically for you.

Ultima Online. You could use the official client, a modified client, the official server, or an open-source server. What a game!Ultima Online. You could use the official client, a modified client, the official server, or an open-source server. What a game!
You would be essentially writing a file with 10-15 lines in it, inheriting from the Dragon class, and adding an intimidating text bubble over their head, or override some method so that they’d spit more fire balls. You’d learn the language and it’s syntax without even trying, just by having fun!

You can check out the RunUO repository on GitHub, although the project isn’t maintained anymore.
After reaping through some C# manuals, I went beyond scripting dragons and started doing more interesting stuff. My two favorite projects were an automated duelling system, and a new spell system.

The administrators would on a somewhat regular basis, host duelling tournaments. They ran everything by hand: they created a couple of portals in popular cities, and asked people to go through them. Then they’d ask people to send them messages if they wanted to participate or just watch. Then they figured out the brackets for the tournament and kept track of who won or lost. Then they manually moved each player into the duelling zone and out of it. I automated all of this by making a few in-game items and writing a lot of code. It was so much fun. I kept drawing brackets to test out my algorithms and ran them in my mind. The ability to run one of these tournaments whenever I wanted and with zero manual action was so relieving.

The script even had fireworks when the tournament ended! 🎉
Later, I open-sourced that duelling system. This was 2006, so my version of open-source back then was opening up a thread on the forums for the server, (which was on SVN back then), and uploading a boatload of documentation and .rar files. After more than a month’s worth of work, the first comment was a bit underwhelming:

“Good job but this thread should be called Tournament System bec its for events.”.
Welcome to open-source!

Another thing I open-sourced, which was far more exciting, was a new spell system: Spellweaving. Ultima Online had a few spell systems (Magery, Necromancy, etc). The real game servers always got the latest patches, but we had to implement these things on our own for the open-source server. Nobody had ever gotten around to implementing Spellweaving, mostly because nobody had the time. I logged into OSI (the official game server) and after around a week of research I was somehow able to implement the entire Spellweaving skill from scratch. This was super fun and exciting. It eventually made its way onto the core RunUO codebase, but not before I had it on my own game servers exclusively for a few months, because I wanted players on my server to savor Spellweaving exclusively for a while.

Eventually, a friend revealed that I could make a living out of writing C# code — “You know, people actually pay you to do that”. That’s when I started developing websites again, except I wasn’t just using Front Page and piles of <blink> and <marquee> tags or Java applets, just for fun, anymore.

## A Web Developer Arises

As a web developer, the first few things I worked on were on PHP and C#. The PHP job was before I knew C# was a thing. Imagine that? Such disconnect. How could I not even know C# was a serious language people paid you to work with?

I was just so in love with the C# programming language I couldn’t even fathom people actually paying for you to write code in C#.

Anyways, my PHP job was not interesting. So I quit for a job that paid even less, but where I could use C#.

When I started working with ASP.NET, I had to build a CMS on my own, which was pretty fun. I had one of those “one pixel to the left” kind of bosses, and left promptly after I shipped the first version of the CMS, but I did learn a ton about design at that job. Not from my boss, obviously. He didn’t even want me to “commit” to jQuery, because it didn’t seem like such a safe bet. This was like 7 years ago, jQuery was all the rage back then. I went for jQuery anyways. He couldn’t get enough of those sliding animations. I did not like my boss.

After that job I went to a consulting company, where some serious C# and .NET development happened. I worked with ASP.NET MVC and did a ton of front-end work. Nobody at the company – except for maybe a couple guys – seemed to like front-end development. I did not understand. JavaScript was fun. It was certainly not C#, but it didn’t need to be so complicated either. For a time, I was the go-to front-end guy at this company and I really enjoyed that.

Two years later, I spent literally a week configuring my development environment for a new project with a big player in the music industry, and decided it was time to quit.

I had a short stint at another consulting company where I also spent time with.NET technologies, WebSockets, and C#. I saw people using Sublime Text. I was not impressed. I was a man of an IDE. Why would you not use Visual Studio? What even was a terminal prompt, anyway?

Then Node.js piqued my interest.

## The Pragmatic Programmer — Node.js, and Pony Foo

A few years ago I read The Pragmatic Programmer, and something clicked inside me. The book has an assortment of solid advice, and I can’t recommend it highly enough. Among that advice, the authors advocate that you get out of your comfort zone and try something you’ve been meaning to, but hadn’t gotten around to. My comfort zone being C# and ASP.NET at that point, I decided to try Node.js, an unmistakably UNIX-y platform for JavaScript development on the server-side, certainly a break from my Microsoft-ridden development experience thus far.

I learned a ton from that experiment, and ended up with this blog 🦄 where I would write about everything I learned in the process. Around half a year later I got an idea where I’d put my years of experience in C# design into a book about JavaScript. I contacted Manning and they jumped at the opportunity, helping me brainstorm and turn raw ideas into something more deliberate and concise.

Pony Foo. Humble beginnings. The design was terrible, but it got the job done!Pony Foo. Humble beginnings. The design was terrible, but it got the job done!
When it comes to this website, I iterated it into an over-engineered pile of code that does everything but brew coffee. It’s definitely not Ultima Online, but part of Ultima’s magic was in the learning process, and I still get to implement thrilling stuff once in a while, such as the git integration or the Pony Foo Weekly back-end.

You know the rest: I worked for a few startups, wrote some more, did some consulting, and now love every day at Elastic using ES6, Webpack, React, Redux, and friends.

It still feels like a game to me. What’s your story?
