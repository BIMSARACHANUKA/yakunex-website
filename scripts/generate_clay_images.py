# pyright: reportMissingImports=false, reportMissingModuleSource=false
import math
import os
from PIL import Image, ImageDraw, ImageFilter  # type: ignore

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out_dir = os.path.join(BASE_DIR, "public", "images", "services")
os.makedirs(out_dir, exist_ok=True)

# 16 service visual definitions with unique themes and 3D clay motifs
services = [
    {
        "slug": "software-dev",
        "title": "Software Development",
        "category": "Build",
        "symbol": "code",
        "accent": (255, 209, 47),
        "shape": "cube_stack"
    },
    {
        "slug": "web-dev",
        "title": "Web Development",
        "category": "Build",
        "symbol": "globe",
        "accent": (255, 215, 60),
        "shape": "sphere_ring"
    },
    {
        "slug": "mobile-development",
        "title": "Mobile Development",
        "category": "Build",
        "symbol": "phone",
        "accent": (255, 195, 40),
        "shape": "tablet"
    },
    {
        "slug": "ui-ux-design",
        "title": "UI/UX Design",
        "category": "Design",
        "symbol": "palette",
        "accent": (255, 225, 80),
        "shape": "palette_blob"
    },
    {
        "slug": "graphic-design",
        "title": "Graphic Design",
        "category": "Design",
        "symbol": "pen",
        "accent": (245, 185, 35),
        "shape": "geometric_gem"
    },
    {
        "slug": "ai-solutions",
        "title": "AI & Automation",
        "category": "Build",
        "symbol": "neural",
        "accent": (255, 230, 90),
        "shape": "neural_core"
    },
    {
        "slug": "ai-chatbot-development",
        "title": "AI Chatbot",
        "category": "Build",
        "symbol": "bot",
        "accent": (255, 210, 50),
        "shape": "bot_capsule"
    },
    {
        "slug": "data-analytics",
        "title": "Data Analytics",
        "category": "Build",
        "symbol": "chart",
        "accent": (250, 190, 45),
        "shape": "cylinder_stack"
    },
    {
        "slug": "database-solutions",
        "title": "Database Solutions",
        "category": "Infrastructure",
        "symbol": "database",
        "accent": (255, 205, 45),
        "shape": "disc_cluster"
    },
    {
        "slug": "cloud-solutions",
        "title": "Cloud Infrastructure",
        "category": "Infrastructure",
        "symbol": "cloud",
        "accent": (255, 220, 70),
        "shape": "cloud_puffy"
    },
    {
        "slug": "devops",
        "title": "DevOps & CI/CD",
        "category": "Infrastructure",
        "symbol": "loop",
        "accent": (255, 200, 40),
        "shape": "torus_loop"
    },
    {
        "slug": "cybersecurity",
        "title": "Cybersecurity",
        "category": "Infrastructure",
        "symbol": "shield",
        "accent": (255, 215, 55),
        "shape": "shield_emblem"
    },
    {
        "slug": "it-consulting",
        "title": "IT Consulting",
        "category": "Advisory",
        "symbol": "briefcase",
        "accent": (245, 195, 40),
        "shape": "pyramid_tier"
    },
    {
        "slug": "it-support",
        "title": "IT Support",
        "category": "Infrastructure",
        "symbol": "wrench",
        "accent": (255, 210, 50),
        "shape": "hex_gear"
    },
    {
        "slug": "digital-marketing",
        "title": "Digital Marketing",
        "category": "Design",
        "symbol": "megaphone",
        "accent": (255, 225, 75),
        "shape": "cone_satellite"
    },
    {
        "slug": "it-training",
        "title": "IT Training",
        "category": "Advisory",
        "symbol": "grad",
        "accent": (255, 205, 45),
        "shape": "stacked_books"
    }
]

WIDTH, HEIGHT = 720, 480

def create_clay_surface(w, h, base_color=(16, 16, 18)):
    # Render rich multi-gradient dark luxury clay background
    img = Image.new("RGBA", (w, h), (7, 7, 9, 255))
    draw = ImageDraw.Draw(img)
    
    # Subtle ambient golden light from top-left
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    cx, cy = int(w * 0.4), int(h * 0.45)
    max_r = int(math.hypot(w, h) * 0.6)
    
    for r in range(max_r, 0, -8):
        alpha = int(45 * (1.0 - (r / max_r) ** 0.8))
        ov_draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=(255, 209, 47, max(0, min(255, alpha // 3)))
        )
    
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=25))
    img = Image.alpha_composite(img, overlay)
    return img

def draw_clay_card(img, rect, accent=(255, 209, 47), shape="cube_stack"):
    w, h = img.size
    x0, y0, x1, y1 = rect
    cx = (x0 + x1) // 2
    cy = (y0 + y1) // 2
    
    # 1. Big soft contact drop shadow for Claymorphism
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_offset_x = 16
    s_offset_y = 24
    s_radius = 36
    s_draw.rounded_rectangle(
        [x0 + s_offset_x, y0 + s_offset_y, x1 + s_offset_x, y1 + s_offset_y],
        radius=s_radius,
        fill=(0, 0, 0, 210)
    )
    # Secondary ambient gold tinted shadow
    s_draw.rounded_rectangle(
        [x0 - 8, y0 - 8, x1 + 8, y1 + 8],
        radius=s_radius,
        fill=(int(accent[0]*0.15), int(accent[1]*0.12), int(accent[2]*0.02), 70)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=28))
    img = Image.alpha_composite(img, shadow)
    
    # 2. Main Clay Body (Tactile dark graphite clay pillow)
    body = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(body)
    corner_r = 34
    
    # Fill base matte clay color
    b_draw.rounded_rectangle(
        [x0, y0, x1, y1],
        radius=corner_r,
        fill=(19, 19, 23, 255),
        outline=(int(accent[0]*0.6), int(accent[1]*0.5), int(accent[2]*0.2), 90),
        width=2
    )
    
    # 3. Inner Bevel Highlight (Top-left light source - Claymorphism signature)
    highlight = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(highlight)
    
    # Top-left inner glow
    for off in range(1, 16):
        alpha = int(95 * (1.0 - (off / 16.0)))
        h_draw.rounded_rectangle(
            [x0 + off, y0 + off, x1 - off, y1 - off],
            radius=max(4, corner_r - off),
            outline=(255, 255, 255, alpha),
            width=2
        )
    # Mask out bottom-right from highlight
    h_mask = Image.new("L", (w, h), 0)
    hm_draw = ImageDraw.Draw(h_mask)
    hm_draw.polygon([(x0 - 20, y0 - 20), (x1 + 20, y0 - 20), (x0 - 20, y1 + 20)], fill=255)
    highlight.putalpha(Image.composite(highlight.split()[3], Image.new("L", (w, h), 0), h_mask))
    highlight = highlight.filter(ImageFilter.GaussianBlur(radius=4))
    body = Image.alpha_composite(body, highlight)
    
    # 4. Inner Bevel Shadow (Bottom-right depth)
    in_shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    is_draw = ImageDraw.Draw(in_shadow)
    for off in range(1, 18):
        alpha = int(140 * (1.0 - (off / 18.0)))
        is_draw.rounded_rectangle(
            [x0 + off, y0 + off, x1 - off, y1 - off],
            radius=max(4, corner_r - off),
            outline=(0, 0, 0, alpha),
            width=2
        )
    is_mask = Image.new("L", (w, h), 0)
    ism_draw = ImageDraw.Draw(is_mask)
    ism_draw.polygon([(x1 + 20, y1 + 20), (x0 - 20, y1 + 20), (x1 + 20, y0 - 20)], fill=255)
    in_shadow.putalpha(Image.composite(in_shadow.split()[3], Image.new("L", (w, h), 0), is_mask))
    in_shadow = in_shadow.filter(ImageFilter.GaussianBlur(radius=4))
    body = Image.alpha_composite(body, in_shadow)
    
    img = Image.alpha_composite(img, body)
    
    # 5. Volumetric 3D Clay Object inside card
    obj = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    obj_cx = cx
    obj_cy = cy - 8
    
    # Clay drop shadow under 3D centerpiece
    obj_shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    os_draw = ImageDraw.Draw(obj_shadow)
    os_draw.ellipse(
        [obj_cx - 85, obj_cy + 55, obj_cx + 85, obj_cy + 95],
        fill=(0, 0, 0, 220)
    )
    os_draw.ellipse(
        [obj_cx - 95, obj_cy + 50, obj_cx + 95, obj_cy + 105],
        fill=(int(accent[0]*0.4), int(accent[1]*0.3), int(accent[2]*0.1), 80)
    )
    obj_shadow = obj_shadow.filter(ImageFilter.GaussianBlur(radius=16))
    img = Image.alpha_composite(img, obj_shadow)
    
    # Draw volumetric shape based on service
    draw_shape_centerpiece(obj, obj_cx, obj_cy, shape, accent)
    img = Image.alpha_composite(img, obj)
    
    # 6. Ambient golden glow particles
    particles = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(particles)
    pts = [
        (obj_cx - 100, obj_cy - 40, 4),
        (obj_cx + 110, obj_cy - 30, 5),
        (obj_cx - 80, obj_cy + 45, 3),
        (obj_cx + 95, obj_cy + 50, 4),
        (obj_cx + 10, obj_cy - 90, 6)
    ]
    for px, py, pr in pts:
        p_draw.ellipse([px - pr*2, py - pr*2, px + pr*2, py + pr*2], fill=(accent[0], accent[1], accent[2], 70))
        p_draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=(255, 255, 230, 220))
    particles = particles.filter(ImageFilter.GaussianBlur(radius=2))
    img = Image.alpha_composite(img, particles)
    
    return img

def draw_shape_centerpiece(canvas, cx, cy, shape, accent):
    draw = ImageDraw.Draw(canvas)
    
    # Draw volumetric clay elements with inflated gradients & highlights
    if "sphere" in shape or shape == "globe":
        # Inflated 3D Clay Sphere
        r = 65
        for i in range(r, 0, -2):
            factor = (r - i) / r
            red = int(24 + factor * (accent[0] - 24))
            green = int(24 + factor * (accent[1] - 24))
            blue = int(28 + factor * (accent[2] - 28))
            draw.ellipse([cx - i - int(factor*15), cy - i - int(factor*18),
                          cx + i - int(factor*15), cy + i - int(factor*18)],
                         fill=(red, green, blue, 255))
        # Orbital clay rings
        draw.arc([cx - 95, cy - 35, cx + 95, cy + 35], 0, 360, fill=(accent[0], accent[1], accent[2], 220), width=6)
        
    elif "cloud" in shape:
        # Volumetric 3D puffy clay cloud
        puffs = [
            (cx - 45, cy + 5, 45),
            (cx + 45, cy + 5, 45),
            (cx, cy - 25, 55),
            (cx - 20, cy - 10, 40),
            (cx + 20, cy - 10, 40)
        ]
        for px, py, pr in puffs:
            for i in range(pr, 0, -2):
                f = (pr - i) / pr
                red = int(28 + f * (accent[0] - 28))
                green = int(28 + f * (accent[1] - 28))
                blue = int(32 + f * (accent[2] - 32))
                draw.ellipse([px - i - int(f*10), py - i - int(f*12),
                              px + i - int(f*10), py + i - int(f*12)],
                             fill=(red, green, blue, 255))
        # Floating golden data nodes underneath
        for nx in [cx - 40, cx, cx + 40]:
            draw.line([(nx, cy + 35), (nx, cy + 60)], fill=(accent[0], accent[1], accent[2], 180), width=3)
            draw.ellipse([nx - 6, cy + 60 - 6, nx + 6, cy + 60 + 6], fill=(255, 255, 200, 255))
            
    elif "neural" in shape or "core" in shape:
        # Glowing 3D neural core with clay nodes
        center_r = 50
        for i in range(center_r, 0, -2):
            f = (center_r - i) / center_r
            r_col = int(30 + f * (accent[0] - 30))
            g_col = int(30 + f * (accent[1] - 30))
            b_col = int(35 + f * (accent[2] - 35))
            draw.ellipse([cx - i - int(f*12), cy - i - int(f*14),
                          cx + i - int(f*12), cy + i - int(f*14)],
                         fill=(r_col, g_col, b_col, 255))
        # Neural satellite nodes
        for angle in range(0, 360, 45):
            rad = math.radians(angle)
            sx = int(cx + math.cos(rad) * 85)
            sy = int(cy + math.sin(rad) * 65)
            draw.line([(cx, cy), (sx, sy)], fill=(accent[0], accent[1], accent[2], 140), width=3)
            draw.ellipse([sx - 10, sy - 10, sx + 10, sy + 10], fill=(255, 230, 100, 255))
            
    elif "shield" in shape:
        # Volumetric 3D clay shield
        pts = [
            (cx - 55, cy - 50),
            (cx + 55, cy - 50),
            (cx + 55, cy + 10),
            (cx, cy + 65),
            (cx - 55, cy + 10)
        ]
        draw.polygon(pts, fill=(28, 28, 34, 255), outline=(accent[0], accent[1], accent[2], 220))
        # Inner golden crest
        inner_pts = [
            (cx - 38, cy - 38),
            (cx + 38, cy - 38),
            (cx + 38, cy + 5),
            (cx, cy + 45),
            (cx - 38, cy + 5)
        ]
        draw.polygon(inner_pts, fill=(int(accent[0]*0.85), int(accent[1]*0.8), int(accent[2]*0.2), 255))
        # Center checkmark / keyhole
        draw.line([(cx - 15, cy - 2), (cx - 3, cy + 12), (cx + 18, cy - 14)], fill=(255, 255, 255, 255), width=5)
        
    elif "phone" in shape or "tablet" in shape:
        # Volumetric 3D clay smartphone / device
        draw.rounded_rectangle([cx - 42, cy - 65, cx + 42, cy + 65], radius=18,
                               fill=(26, 26, 32, 255), outline=(accent[0], accent[1], accent[2], 200), width=3)
        draw.rounded_rectangle([cx - 34, cy - 52, cx + 34, cy + 48], radius=12,
                               fill=(12, 12, 16, 255))
        # App cards inside screen
        draw.rounded_rectangle([cx - 26, cy - 42, cx + 26, cy - 18], radius=6, fill=(accent[0], accent[1], accent[2], 210))
        draw.rounded_rectangle([cx - 26, cy - 10, cx + 8, cy + 8], radius=6, fill=(45, 45, 55, 255))
        draw.rounded_rectangle([cx + 14, cy - 10, cx + 26, cy + 8], radius=6, fill=(accent[0], accent[1], accent[2], 160))
        draw.ellipse([cx - 5, cy + 52, cx + 5, cy + 62], fill=(80, 80, 95, 255))
        
    else:
        # Default: Stacked volumetric isometric 3D clay cubes / cylinders
        # Base plate
        draw.rounded_rectangle([cx - 75, cy + 10, cx + 75, cy + 55], radius=16,
                               fill=(25, 25, 30, 255), outline=(accent[0], accent[1], accent[2], 120), width=2)
        # Mid cube
        draw.rounded_rectangle([cx - 50, cy - 25, cx + 50, cy + 25], radius=14,
                               fill=(35, 35, 42, 255), outline=(accent[0], accent[1], accent[2], 180), width=2)
        # Top glowing gold block
        draw.rounded_rectangle([cx - 30, cy - 58, cx + 30, cy - 6], radius=10,
                               fill=(accent[0], accent[1], accent[2], 255))
        # Inset highlights
        draw.line([(cx - 22, cy - 50), (cx + 22, cy - 50)], fill=(255, 255, 255, 180), width=2)

def generate_all():
    print(f"Generating {len(services)} 3D Claymorphic service images...")
    
    card_rect = [100, 40, WIDTH - 100, HEIGHT - 40]
    
    for s in services:
        out_path = os.path.join(out_dir, f"{s['slug']}.webp")
        base = create_clay_surface(WIDTH, HEIGHT)
        final_img = draw_clay_card(base, card_rect, accent=s["accent"], shape=s["shape"])
        
        # Save as WebP high quality
        final_img.save(out_path, format="WEBP", quality=92, method=6)
        print(f"Generated: {s['slug']}.webp ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    generate_all()

# Process step images
steps = [
    {"name": "step-1-discover", "num": "01", "label": "DISCOVER", "accent": (255, 209, 47), "shape": "sphere_ring"},
    {"name": "step-2-plan", "num": "02", "label": "PLAN", "accent": (255, 220, 60), "shape": "cube_stack"},
    {"name": "step-3-build", "num": "03", "label": "BUILD", "accent": (255, 195, 40), "shape": "neural_core"},
    {"name": "step-4-deliver", "num": "04", "label": "DELIVER", "accent": (255, 215, 55), "shape": "shield_emblem"}
]

for st in steps:
    out_path = os.path.join(out_dir, f"{st['name']}.webp")
    base = create_clay_surface(WIDTH, HEIGHT)
    final_img = draw_clay_card(base, [100, 40, WIDTH - 100, HEIGHT - 40], accent=st["accent"], shape=st["shape"])
    final_img.save(out_path, format="WEBP", quality=92, method=6)
    print(f"Generated step: {st['name']}.webp")
