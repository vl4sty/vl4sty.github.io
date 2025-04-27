document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const icons = {
        webico1: new Image(),
        webico2: new Image(),
        webico3: new Image(),
    };
    icons.webico1.src = "web/img/webico/webico1.PNG";
    icons.webico2.src = "web/img/webico/webico2.PNG";
    icons.webico3.src = "web/img/webico/webico3.PNG";

    const colors = [
        "rgb(27, 46, 148)",
        "rgb(108, 25, 134)",
        "rgb(209, 47, 55)",
    ];

    let fireworks = [];
    const MAX_FIRE = 2;

    class Particle {
        constructor(x, y, color, velocity) {
            this.x = x; this.y = y;
            this.color = color;
            this.velocity = velocity;
            this.alpha = 1;
            this.friction = 1;
            this.gravity = 0.025;
            if (color === "rgb(27, 46, 148)") this.img = icons.webico1;
            else if (color === "rgb(108, 25, 134)") this.img = icons.webico2;
            else if (color === "rgb(209, 47, 55)") this.img = icons.webico3;
        }

        update() {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.velocity.y += this.gravity;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.005;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            const size = 64;
            ctx.drawImage(
                this.img,
                this.x - size / 2,
                this.y - size / 2,
                size,
                size
            );
            ctx.restore();
        }
    }

    class Firework {
        constructor(x, y, targetY, color) {
            this.x = x;
            this.y = y;
            this.targetY = targetY;
            this.color = color;
            this.particles = [];
            this.exploded = false;

            const minAngle = 1;
            const maxAngle = 2;
            const angle = Math.random() * (maxAngle - minAngle) + minAngle;
            const speed = 5;
            this.velocity = {
                x: Math.cos(angle) * speed,
                y: -Math.sin(angle) * speed
            };
        }

        explode() {
            for (let i = 0; i < 50; i++) {
                const ang = Math.random() * Math.PI * 2;
                const spd = Math.random() * 4 + 0.5;
                this.particles.push(new Particle(
                    this.x, this.y, this.color,
                    { x: Math.cos(ang) * spd, y: Math.sin(ang) * spd }
                ));
            }
            this.exploded = true;
        }

        update() {
            if (!this.exploded) {
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                if (this.y <= this.targetY) {
                    this.explode();
                }
            } else {
                this.particles.forEach(p => p.update());
                this.particles = this.particles.filter(p => p.alpha > 0);
            }
        }

        draw() {
            if (!this.exploded) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            this.particles.forEach(p => p.draw());
        }
    }

    function spawnFirework() {
        if (fireworks.length < MAX_FIRE) {
            const x = Math.random() * canvas.width;
            const y = canvas.height;
            const targetY = Math.random() * canvas.height / 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            fireworks.push(new Firework(x, y, targetY, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach((fw, i) => {
            fw.update();
            fw.draw();
            if (fw.exploded && fw.particles.length === 0) {
                fireworks.splice(i, 1);
            }
        });
    }

    setInterval(spawnFirework, 1000);
    animate();
});