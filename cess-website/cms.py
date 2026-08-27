import json
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import subprocess

# ======================================================================
#   ENABLE PASTE IN ALL TEXT FIELDS (FIX FOR WINDOWS / macOS / LINUX)
# ======================================================================

def enable_paste(widget):
    def paste(event=None):
        try:
            widget.insert("insert", widget.clipboard_get())
        except Exception:
            pass
        return "break"

    widget.bind("<Control-v>", paste)
    widget.bind("<Control-V>", paste)
    widget.bind("<Command-v>", paste)  # macOS
    widget.bind("<Button-3>", paste)   # right click (common)
    widget.bind("<Button-2>", paste)   # middle click (some Linux)


# ======================================================================
#   FILE HELPERS
# ======================================================================

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ======================================================================
#   FILE PATHS
# ======================================================================

EN_PATH = "src/data/en.json"
AR_PATH = "src/data/Ar.json"   # keep as your original path
BLOG_PATH = "src/data/blog.json"
TICKER_PATH = "src/data/ticker.json"

en_data = load_json(EN_PATH)
ar_data = load_json(AR_PATH)
blog_data = load_json(BLOG_PATH)
ticker_data = load_json(TICKER_PATH)


# ======================================================================
#   TKINTER WINDOW (IMPROVED LAYOUT)
# ======================================================================

root = tk.Tk()
root.title("CESS Local CMS")
root.geometry("900x700")
root.minsize(760, 560)

# Root grid: notebook expands, bottom bar stays fixed
root.grid_rowconfigure(0, weight=1)
root.grid_columnconfigure(0, weight=1)

notebook = ttk.Notebook(root)
notebook.grid(row=0, column=0, sticky="nsew")


# ======================================================================
#   SCROLLABLE TAB HELPER
# ======================================================================

def make_scrollable_tab(parent_notebook, title):
    """
    Creates a notebook tab with a vertical scrollbar.
    Returns:
        outer_frame, inner_content_frame
    Put your widgets into inner_content_frame.
    """
    outer = ttk.Frame(parent_notebook)
    parent_notebook.add(outer, text=title)

    canvas = tk.Canvas(outer, highlightthickness=0)
    vbar = ttk.Scrollbar(outer, orient="vertical", command=canvas.yview)
    canvas.configure(yscrollcommand=vbar.set)

    vbar.pack(side="right", fill="y")
    canvas.pack(side="left", fill="both", expand=True)

    inner = ttk.Frame(canvas)
    win_id = canvas.create_window((0, 0), window=inner, anchor="nw")

    def _on_inner_configure(event=None):
        canvas.configure(scrollregion=canvas.bbox("all"))

    def _on_canvas_configure(event):
        canvas.itemconfigure(win_id, width=event.width)

    inner.bind("<Configure>", _on_inner_configure)
    canvas.bind("<Configure>", _on_canvas_configure)

    # Mouse wheel only when cursor is over this canvas
    def _bind_wheel(_event=None):
        canvas.bind_all("<MouseWheel>", _on_mousewheel)
        canvas.bind_all("<Button-4>", _on_mousewheel_linux)  # Linux up
        canvas.bind_all("<Button-5>", _on_mousewheel_linux)  # Linux down

    def _unbind_wheel(_event=None):
        canvas.unbind_all("<MouseWheel>")
        canvas.unbind_all("<Button-4>")
        canvas.unbind_all("<Button-5>")

    def _on_mousewheel(event):
        # Windows/macOS
        if event.delta:
            step = -1 * int(event.delta / 120)
            if step == 0:
                step = -1 if event.delta > 0 else 1
            canvas.yview_scroll(step, "units")
        return "break"

    def _on_mousewheel_linux(event):
        # Linux
        if event.num == 4:
            canvas.yview_scroll(-1, "units")
        elif event.num == 5:
            canvas.yview_scroll(1, "units")
        return "break"

    canvas.bind("<Enter>", _bind_wheel)
    canvas.bind("<Leave>", _unbind_wheel)

    return outer, inner


# ======================================================================
#   FUNCTION: CREATE TEXT FIELD
# ======================================================================

def create_text_field(parent, label, initial, height=2):
    ttk.Label(parent, text=label).pack(anchor="w", pady=2, padx=10)
    box = scrolledtext.ScrolledText(parent, height=height, wrap="word")
    box.pack(fill="x", pady=3, padx=10)
    box.insert("1.0", initial)
    enable_paste(box)
    return box


# ======================================================================
#   TAB: TICKER (SCROLLABLE)
# ======================================================================

frame_ticker_outer, frame_ticker = make_scrollable_tab(notebook, "Ticker")

ttk.Label(frame_ticker, text="Ticker 1 Text").pack(anchor="w", pady=4, padx=10)
ticker1_box = scrolledtext.ScrolledText(frame_ticker, height=3, wrap="word")
ticker1_box.pack(fill="x", padx=10, pady=4)
ticker1_box.insert("1.0", ticker_data["ticker_1"]["text"])
enable_paste(ticker1_box)

ttk.Label(frame_ticker, text="Ticker 2 Segments").pack(anchor="w", pady=6, padx=10)

ticker_rows = []

def render_ticker_rows():
    for r in ticker_rows:
        r["frame"].destroy()
    ticker_rows.clear()

    for segment in ticker_data["ticker_2"]["segments"]:
        add_ticker_row(segment)

def add_ticker_row(segment=None):
    if segment is None:
        segment = {"type": "text", "value": ""}

    row_frame = ttk.Frame(frame_ticker)
    row_frame.pack(fill="x", pady=3, padx=10)

    type_var = tk.StringVar(value=segment.get("type", "text"))
    type_menu = ttk.Combobox(row_frame, textvariable=type_var, values=["text", "link"], width=8, state="readonly")
    type_menu.grid(row=0, column=0, padx=3, sticky="w")

    label_var = tk.StringVar(value=segment.get("value") or segment.get("label") or "")
    label_entry = ttk.Entry(row_frame, textvariable=label_var, width=35)
    label_entry.grid(row=0, column=1, padx=3, sticky="ew")

    url_var = tk.StringVar(value=segment.get("url", ""))
    url_entry = ttk.Entry(row_frame, textvariable=url_var, width=35)
    url_entry.grid(row=0, column=2, padx=3, sticky="ew")

    row_frame.grid_columnconfigure(1, weight=1)
    row_frame.grid_columnconfigure(2, weight=1)

    if type_var.get() == "text":
        url_entry.grid_remove()

    def update_url(event=None):
        if type_var.get() == "link":
            url_entry.grid()
        else:
            url_entry.grid_remove()

    type_menu.bind("<<ComboboxSelected>>", update_url)

    def delete_row():
        if row_dict in ticker_rows:
            ticker_rows.remove(row_dict)
        row_frame.destroy()

    tk.Button(row_frame, text="X", fg="red", command=delete_row).grid(row=0, column=3, padx=4)

    row_dict = {
        "frame": row_frame,
        "type": type_var,
        "label": label_var,
        "url": url_var
    }
    ticker_rows.append(row_dict)
    update_url()

tk.Button(frame_ticker, text="+ Add Segment", command=lambda: add_ticker_row(None)).pack(pady=6, padx=10, anchor="w")

def save_ticker():
    ticker_data["ticker_1"]["text"] = ticker1_box.get("1.0", "end").strip()

    new_segments = []
    for r in ticker_rows:
        if r["type"].get() == "text":
            new_segments.append({
                "type": "text",
                "value": r["label"].get()
            })
        else:
            new_segments.append({
                "type": "link",
                "label": r["label"].get(),
                "url": r["url"].get()
            })

    ticker_data["ticker_2"]["segments"] = new_segments
    save_json(TICKER_PATH, ticker_data)
    messagebox.showinfo("Saved", "Ticker updated successfully.")

tk.Button(frame_ticker, text="Save Ticker", command=save_ticker).pack(pady=10, padx=10, anchor="w")
render_ticker_rows()


# ======================================================================
#   TAB: ENGLISH (SCROLLABLE)
# ======================================================================

frame_en_outer, frame_en = make_scrollable_tab(notebook, "English")

en_fields = {}
en_fields["hero_title"] = create_text_field(frame_en, "Hero Title", en_data["hero"]["title"])
en_fields["hero_text"] = create_text_field(frame_en, "Hero Text", en_data["hero"]["text"])
en_fields["about_heading"] = create_text_field(frame_en, "About Heading", en_data["about"]["heading"])
en_fields["about_body"] = create_text_field(frame_en, "About Body", en_data["about"]["body"])

def save_en():
    en_data["hero"]["title"] = en_fields["hero_title"].get("1.0", "end").strip()
    en_data["hero"]["text"] = en_fields["hero_text"].get("1.0", "end").strip()
    en_data["about"]["heading"] = en_fields["about_heading"].get("1.0", "end").strip()
    en_data["about"]["body"] = en_fields["about_body"].get("1.0", "end").strip()

    save_json(EN_PATH, en_data)
    messagebox.showinfo("Saved", "English content saved.")

tk.Button(frame_en, text="Save English", command=save_en).pack(pady=10, padx=10, anchor="w")


# ======================================================================
#   TAB: ARABIC (SCROLLABLE)
# ======================================================================

frame_ar_outer, frame_ar = make_scrollable_tab(notebook, "Arabic")

ar_fields = {}
ar_fields["hero_title"] = create_text_field(frame_ar, "Hero Title AR", ar_data["hero"]["title"])
ar_fields["hero_text"] = create_text_field(frame_ar, "Hero Text AR", ar_data["hero"]["text"])
ar_fields["about_heading"] = create_text_field(frame_ar, "About Heading AR", ar_data["about"]["heading"])
ar_fields["about_body"] = create_text_field(frame_ar, "About Body AR", ar_data["about"]["body"])

def save_ar():
    ar_data["hero"]["title"] = ar_fields["hero_title"].get("1.0", "end").strip()
    ar_data["hero"]["text"] = ar_fields["hero_text"].get("1.0", "end").strip()
    ar_data["about"]["heading"] = ar_fields["about_heading"].get("1.0", "end").strip()
    ar_data["about"]["body"] = ar_fields["about_body"].get("1.0", "end").strip()

    save_json(AR_PATH, ar_data)
    messagebox.showinfo("Saved", "Arabic content saved.")

tk.Button(frame_ar, text="Save Arabic", command=save_ar).pack(pady=10, padx=10, anchor="w")


# ======================================================================
#   TAB: PROJECTS ENGLISH (SCROLLABLE)
# ======================================================================

frame_projects_en_outer, frame_projects_En = make_scrollable_tab(notebook, "projects English")
project_fields_En = {}
project_Endata = en_data["projects"]

project_fields_En["projecten_1_header"] = create_text_field(frame_projects_En, "Project-1 English Header", project_Endata["project_1"]["header"])
project_fields_En["projecten_1_body"] = create_text_field(frame_projects_En, "Project-1 English details", project_Endata["project_1"]["body"])

project_fields_En["projecten_2_header"] = create_text_field(frame_projects_En, "Project-2 Header", project_Endata["project_2"]["header"])
project_fields_En["projecten_2_body"] = create_text_field(frame_projects_En, "Project-2 details", project_Endata["project_2"]["body"])

project_fields_En["projecten_3_header"] = create_text_field(frame_projects_En, "Project-3 Header", project_Endata["project_3"]["header"])
project_fields_En["projecten_3_body"] = create_text_field(frame_projects_En, "Project-3 details", project_Endata["project_3"]["body"])

project_fields_En["projecten_4_header"] = create_text_field(frame_projects_En, "Project-4 Header", project_Endata["project_4"]["header"])
project_fields_En["projecten_4_body"] = create_text_field(frame_projects_En, "Project-4 details", project_Endata["project_4"]["body"])

def save_en_project():
    project_Endata["project_1"]["header"] = project_fields_En["projecten_1_header"].get("1.0", "end").strip()
    project_Endata["project_1"]["body"] = project_fields_En["projecten_1_body"].get("1.0", "end").strip()

    project_Endata["project_2"]["header"] = project_fields_En["projecten_2_header"].get("1.0", "end").strip()
    project_Endata["project_2"]["body"] = project_fields_En["projecten_2_body"].get("1.0", "end").strip()

    project_Endata["project_3"]["header"] = project_fields_En["projecten_3_header"].get("1.0", "end").strip()
    project_Endata["project_3"]["body"] = project_fields_En["projecten_3_body"].get("1.0", "end").strip()

    project_Endata["project_4"]["header"] = project_fields_En["projecten_4_header"].get("1.0", "end").strip()
    project_Endata["project_4"]["body"] = project_fields_En["projecten_4_body"].get("1.0", "end").strip()

    save_json(EN_PATH, en_data)
    messagebox.showinfo("Saved", "Project Change content saved.")

tk.Button(frame_projects_En, text="Save Project", command=save_en_project).pack(pady=10, padx=10, anchor="w")


# ======================================================================
#   TAB: PROJECTS ARABIC (SCROLLABLE)
# ======================================================================

frame_projects_ar_outer, frame_projects_Ar = make_scrollable_tab(notebook, "projects Arabic")
project_fields_Ar = {}
project_Ardata = ar_data["projects"]

project_fields_Ar["projectAr_1_header"] = create_text_field(frame_projects_Ar, "Project-1 Arabic Header", project_Ardata["project_1"]["header"])
project_fields_Ar["projecteAr_1_body"] = create_text_field(frame_projects_Ar, "Project-1 Arabic details", project_Ardata["project_1"]["body"])

project_fields_Ar["projectAr_2_header"] = create_text_field(frame_projects_Ar, "Project-2 Arabic Header", project_Ardata["project_2"]["header"])
project_fields_Ar["projecteAr_2_body"] = create_text_field(frame_projects_Ar, "Project-2 Arabic details", project_Ardata["project_2"]["body"])

project_fields_Ar["projectAr_3_header"] = create_text_field(frame_projects_Ar, "Project-3 Arabic Header", project_Ardata["project_3"]["header"])
project_fields_Ar["projecteAr_3_body"] = create_text_field(frame_projects_Ar, "Project-3 Arabic details", project_Ardata["project_3"]["body"])

project_fields_Ar["projectAr_4_header"] = create_text_field(frame_projects_Ar, "Project-4 Arabic Header", project_Ardata["project_4"]["header"])
project_fields_Ar["projecteAr_4_body"] = create_text_field(frame_projects_Ar, "Project-4 Arabic details", project_Ardata["project_4"]["body"])

def save_ar_project():
    project_Ardata["project_1"]["header"] = project_fields_Ar["projectAr_1_header"].get("1.0", "end").strip()
    project_Ardata["project_1"]["body"] = project_fields_Ar["projecteAr_1_body"].get("1.0", "end").strip()

    project_Ardata["project_2"]["header"] = project_fields_Ar["projectAr_2_header"].get("1.0", "end").strip()
    project_Ardata["project_2"]["body"] = project_fields_Ar["projecteAr_2_body"].get("1.0", "end").strip()

    project_Ardata["project_3"]["header"] = project_fields_Ar["projectAr_3_header"].get("1.0", "end").strip()
    project_Ardata["project_3"]["body"] = project_fields_Ar["projecteAr_3_body"].get("1.0", "end").strip()

    project_Ardata["project_4"]["header"] = project_fields_Ar["projectAr_4_header"].get("1.0", "end").strip()
    project_Ardata["project_4"]["body"] = project_fields_Ar["projecteAr_4_body"].get("1.0", "end").strip()

    save_json(AR_PATH, ar_data)
    messagebox.showinfo("Saved", "Project Change content saved.")

tk.Button(frame_projects_Ar, text="Save Project", command=save_ar_project).pack(pady=10, padx=10, anchor="w")
# ======================================================================
#   TAB: PUBLICATIONS MANAGER (SCROLLABLE)  ✅ NEW
#   Updates BOTH src/data/en.json and src/data/Ar.json
# ======================================================================

frame_pubs_outer, frame_pubs = make_scrollable_tab(notebook, "Publications")

# ---- helpers to deal with publication_1, publication_2, ...
def _pub_keys(data):
    pubs = data.get("publications", {})
    keys = [k for k in pubs.keys() if k.startswith("publication_")]
    # Sort by numeric suffix if possible
    def _num(k):
        try:
            return int(k.split("_")[-1])
        except Exception:
            return 10**9
    return sorted(keys, key=_num)

def _next_pub_key(en_data, ar_data):
    keys = set(_pub_keys(en_data)) | set(_pub_keys(ar_data))
    nums = []
    for k in keys:
        try:
            nums.append(int(k.split("_")[-1]))
        except Exception:
            pass
    nxt = (max(nums) + 1) if nums else 1
    return f"publication_{nxt}"

# ---- heading (optional but useful)
ttk.Label(frame_pubs, text="Publications Heading (EN)").pack(anchor="w", padx=10, pady=(8, 2))
pub_heading_en = scrolledtext.ScrolledText(frame_pubs, height=2, wrap="word")
pub_heading_en.pack(fill="x", padx=10, pady=(0, 8))
pub_heading_en.insert("1.0", en_data.get("publications", {}).get("heading", ""))
enable_paste(pub_heading_en)

ttk.Label(frame_pubs, text="Publications Heading (AR)").pack(anchor="w", padx=10, pady=(2, 2))
pub_heading_ar = scrolledtext.ScrolledText(frame_pubs, height=2, wrap="word")
pub_heading_ar.pack(fill="x", padx=10, pady=(0, 10))
pub_heading_ar.insert("1.0", ar_data.get("publications", {}).get("heading", ""))
enable_paste(pub_heading_ar)

# ---- selector
ttk.Label(frame_pubs, text="Select Publication Key (publication_1, publication_2, ...)").pack(anchor="w", padx=10, pady=(8, 2))
pub_selector = ttk.Combobox(frame_pubs, values=_pub_keys(en_data), state="readonly")
pub_selector.pack(fill="x", padx=10, pady=(0, 10))

# ---- fields (EN + AR side by side feel, stacked for simplicity)
pub_fields = {}

def _pub_field(label, height=2):
    ttk.Label(frame_pubs, text=label).pack(anchor="w", padx=10)
    box = scrolledtext.ScrolledText(frame_pubs, height=height, wrap="word")
    box.pack(fill="x", padx=10, pady=4)
    enable_paste(box)
    return box

# English fields
pub_fields["en_header"] = _pub_field("EN • Header", height=2)
pub_fields["en_description"] = _pub_field("EN • Description", height=3)
pub_fields["en_year"] = _pub_field("EN • Year", height=1)
pub_fields["en_link"] = _pub_field("EN • Link", height=2)

# Arabic fields
pub_fields["ar_header"] = _pub_field("AR • Header", height=2)
pub_fields["ar_description"] = _pub_field("AR • Description", height=3)
pub_fields["ar_year"] = _pub_field("AR • Year", height=1)
pub_fields["ar_link"] = _pub_field("AR • Link", height=2)

def load_publication(event=None):
    key = pub_selector.get()
    if not key:
        return

    en_pub = en_data.get("publications", {}).get(key, {})
    ar_pub = ar_data.get("publications", {}).get(key, {})

    # clear then fill
    for k in pub_fields:
        pub_fields[k].delete("1.0", "end")

    pub_fields["en_header"].insert("1.0", en_pub.get("header", ""))
    pub_fields["en_description"].insert("1.0", en_pub.get("description", ""))
    pub_fields["en_year"].insert("1.0", str(en_pub.get("year", "")))
    pub_fields["en_link"].insert("1.0", en_pub.get("link", ""))

    pub_fields["ar_header"].insert("1.0", ar_pub.get("header", ""))
    pub_fields["ar_description"].insert("1.0", ar_pub.get("description", ""))
    pub_fields["ar_year"].insert("1.0", str(ar_pub.get("year", "")))
    pub_fields["ar_link"].insert("1.0", ar_pub.get("link", ""))

pub_selector.bind("<<ComboboxSelected>>", load_publication)

def add_new_publication():
    # Ensure publications containers exist
    en_data.setdefault("publications", {}).setdefault("heading", en_data.get("publications", {}).get("heading", "Publications"))
    ar_data.setdefault("publications", {}).setdefault("heading", ar_data.get("publications", {}).get("heading", "المنشورات"))

    new_key = _next_pub_key(en_data, ar_data)

    en_data["publications"][new_key] = {
        "header": "",
        "description": "",
        "year": "",
        "link": ""
    }
    ar_data["publications"][new_key] = {
        "header": "",
        "description": "",
        "year": "",
        "link": ""
    }

    # refresh selector values (prefer EN list)
    pub_selector["values"] = _pub_keys(en_data)
    pub_selector.set(new_key)
    load_publication()

    messagebox.showinfo("New Publication", f"Created {new_key} (EN+AR). Fill fields then Save.")

def delete_publication():
    key = pub_selector.get()
    if not key:
        messagebox.showerror("Error", "Select a publication first.")
        return

    if not messagebox.askyesno("Confirm", f"Delete {key} from BOTH EN and AR?"):
        return

    if "publications" in en_data and key in en_data["publications"]:
        del en_data["publications"][key]
    if "publications" in ar_data and key in ar_data["publications"]:
        del ar_data["publications"][key]

    save_json(EN_PATH, en_data)
    save_json(AR_PATH, ar_data)

    pub_selector["values"] = _pub_keys(en_data)
    pub_selector.set("")

    for k in pub_fields:
        pub_fields[k].delete("1.0", "end")

    messagebox.showinfo("Deleted", f"{key} deleted from EN+AR.")

def save_publication():
    key = pub_selector.get()
    if not key:
        messagebox.showerror("Error", "Select a publication first.")
        return

    # save headings too
    en_data.setdefault("publications", {})
    ar_data.setdefault("publications", {})
    en_data["publications"]["heading"] = pub_heading_en.get("1.0", "end").strip()
    ar_data["publications"]["heading"] = pub_heading_ar.get("1.0", "end").strip()

    # ensure objects exist
    en_data["publications"].setdefault(key, {})
    ar_data["publications"].setdefault(key, {})

    en_data["publications"][key]["header"] = pub_fields["en_header"].get("1.0", "end").strip()
    en_data["publications"][key]["description"] = pub_fields["en_description"].get("1.0", "end").strip()
    en_data["publications"][key]["year"] = pub_fields["en_year"].get("1.0", "end").strip()
    en_data["publications"][key]["link"] = pub_fields["en_link"].get("1.0", "end").strip()

    ar_data["publications"][key]["header"] = pub_fields["ar_header"].get("1.0", "end").strip()
    ar_data["publications"][key]["description"] = pub_fields["ar_description"].get("1.0", "end").strip()
    ar_data["publications"][key]["year"] = pub_fields["ar_year"].get("1.0", "end").strip()
    ar_data["publications"][key]["link"] = pub_fields["ar_link"].get("1.0", "end").strip()

    save_json(EN_PATH, en_data)
    save_json(AR_PATH, ar_data)
    messagebox.showinfo("Saved", f"{key} updated in EN+AR.")

# ---- action buttons row
pub_actions = ttk.Frame(frame_pubs)
pub_actions.pack(fill="x", padx=10, pady=12)

tk.Button(pub_actions, text="+ Add New Publication", command=add_new_publication).pack(side="left", padx=(0, 8))
tk.Button(pub_actions, text="Delete Publication", fg="red", command=delete_publication).pack(side="left", padx=(0, 8))
tk.Button(pub_actions, text="Save Publication", command=save_publication).pack(side="left")

# ---- init selector list
pub_selector["values"] = _pub_keys(en_data)
if _pub_keys(en_data):
    pub_selector.set(_pub_keys(en_data)[0])
    load_publication()


# ======================================================================
#   TAB: BLOG MANAGER (SCROLLABLE)
# ======================================================================

frame_blog_outer, frame_blog = make_scrollable_tab(notebook, "Blog")

ttk.Label(frame_blog, text="Select Post ID").pack(anchor="w", padx=10, pady=(8, 2))
post_selector = ttk.Combobox(frame_blog, values=[p["id"] for p in blog_data["posts"]], state="readonly")
post_selector.pack(fill="x", padx=10, pady=5)

blog_fields = {}

def create_blog_field(label):
    ttk.Label(frame_blog, text=label).pack(anchor="w", padx=10)
    box = scrolledtext.ScrolledText(frame_blog, height=3, wrap="word")
    box.pack(fill="x", padx=10, pady=3)
    enable_paste(box)
    return box

blog_fields["title_en"] = create_blog_field("Title (EN)")
blog_fields["title_ar"] = create_blog_field("Title (AR)")
blog_fields["preview_en"] = create_blog_field("Preview (EN)")
blog_fields["preview_ar"] = create_blog_field("Preview (AR)")
blog_fields["body_en"] = create_blog_field("Body (EN)")
blog_fields["body_ar"] = create_blog_field("Body (AR)")
blog_fields["author_en"] = create_blog_field("Author (EN)")
blog_fields["author_ar"] = create_blog_field("Author (AR)")

def load_post(event=None):
    pid = post_selector.get()
    post = next((p for p in blog_data["posts"] if p["id"] == pid), None)
    if not post:
        return

    for key in blog_fields:
        blog_fields[key].delete("1.0", "end")
        blog_fields[key].insert("1.0", post.get(key, ""))

post_selector.bind("<<ComboboxSelected>>", load_post)

def add_new_post():
    try:
        existing_ids = [int(p["id"]) for p in blog_data["posts"] if str(p.get("id", "")).isdigit()]
    except Exception:
        existing_ids = []
    next_id = str(max(existing_ids) + 1) if existing_ids else "1"

    new_post = {
        "id": next_id,
        "title_en": "",
        "title_ar": "",
        "preview_en": "",
        "preview_ar": "",
        "body_en": "",
        "body_ar": "",
        "author_en": "",
        "author_ar": ""
    }

    blog_data["posts"].append(new_post)
    post_selector["values"] = [p["id"] for p in blog_data["posts"]]
    post_selector.set(next_id)

    for key in blog_fields:
        blog_fields[key].delete("1.0", "end")

    messagebox.showinfo("New Post", f"Created new post: {next_id}")

def delete_post():
    pid = post_selector.get()
    if not pid:
        messagebox.showerror("Error", "Select a post to delete.")
        return

    if not messagebox.askyesno("Confirm", f"Delete post {pid}?"):
        return

    blog_data["posts"] = [p for p in blog_data["posts"] if p["id"] != pid]
    save_json(BLOG_PATH, blog_data)

    post_selector["values"] = [p["id"] for p in blog_data["posts"]]
    post_selector.set("")

    for key in blog_fields:
        blog_fields[key].delete("1.0", "end")

    messagebox.showinfo("Deleted", f"Post {pid} deleted.")

def save_post():
    pid = post_selector.get()
    post = next((p for p in blog_data["posts"] if p["id"] == pid), None)

    if not post:
        messagebox.showerror("Error", "Select a post first.")
        return

    for key in blog_fields:
        post[key] = blog_fields[key].get("1.0", "end").strip()

    save_json(BLOG_PATH, blog_data)
    messagebox.showinfo("Saved", "Blog post updated.")

# Blog action row
blog_actions = ttk.Frame(frame_blog)
blog_actions.pack(fill="x", padx=10, pady=10)

tk.Button(blog_actions, text="+ Add New Post", command=add_new_post).pack(side="left", padx=(0, 8))
tk.Button(blog_actions, text="Delete Post", fg="red", command=delete_post).pack(side="left", padx=(0, 8))
tk.Button(blog_actions, text="Save Post", command=save_post).pack(side="left")

# ======================================================================
#   TAB: conflict MANAGER (SCROLLABLE)  ✅ NEW
#   Updates BOTH src/data/en.json and src/data/Ar.json
# ======================================================================

frame_pubs_outer, frame_pubs = make_scrollable_tab(notebook, "conflict")

# ---- helpers to deal with project_1, project_2, ...
def _pub_keys(data):
    pubs = data.get("project", {})
    keys = [k for k in pubs.keys() if k.startswith("project_")]
    # Sort by numeric suffix if possible
    def _num(k):
        try:
            return int(k.split("_")[-1])
        except Exception:
            return 10**9
    return sorted(keys, key=_num)

def _next_pub_key(en_data, ar_data):
    keys = set(_pub_keys(en_data)) | set(_pub_keys(ar_data))
    nums = []
    for k in keys:
        try:
            nums.append(int(k.split("_")[-1]))
        except Exception:
            pass
    nxt = (max(nums) + 1) if nums else 1
    return f"project_{nxt}"

# ---- heading (optional but useful)
ttk.Label(frame_pubs, text="project Heading (EN)").pack(anchor="w", padx=10, pady=(8, 2))
pub_heading_en = scrolledtext.ScrolledText(frame_pubs, height=2, wrap="word")
pub_heading_en.pack(fill="x", padx=10, pady=(0, 8))
pub_heading_en.insert("1.0", en_data.get("project", {}).get("heading", ""))
enable_paste(pub_heading_en)

ttk.Label(frame_pubs, text="project Heading (AR)").pack(anchor="w", padx=10, pady=(2, 2))
pub_heading_ar = scrolledtext.ScrolledText(frame_pubs, height=2, wrap="word")
pub_heading_ar.pack(fill="x", padx=10, pady=(0, 10))
pub_heading_ar.insert("1.0", ar_data.get("project", {}).get("heading", ""))
enable_paste(pub_heading_ar)

# ---- selector
ttk.Label(frame_pubs, text="Select project Key (project_1, project_2, ...)").pack(anchor="w", padx=10, pady=(8, 2))
pro_selector = ttk.Combobox(frame_pubs, values=_pub_keys(en_data), state="readonly")
pro_selector.pack(fill="x", padx=10, pady=(0, 10))

# ---- fields (EN + AR side by side feel, stacked for simplicity)
pro_fields = {}

def _pro_fields(label, height=2):
    ttk.Label(frame_pubs, text=label).pack(anchor="w", padx=10)
    box = scrolledtext.ScrolledText(frame_pubs, height=height, wrap="word")
    box.pack(fill="x", padx=10, pady=4)
    enable_paste(box)
    return box

# English fields
pro_fields["en_header"] = _pub_field("EN • Header", height=2)
pro_fields["en_description"] = _pub_field("EN • Description", height=3)
pro_fields["en_year"] = _pub_field("EN • Year", height=1)
pro_fields["en_link"] = _pub_field("EN • Link", height=2)

# Arabic fields
pro_fields["ar_header"] = _pub_field("AR • Header", height=2)
pro_fields["ar_description"] = _pub_field("AR • Description", height=3)
pro_fields["ar_year"] = _pub_field("AR • Year", height=1)
pro_fields["ar_link"] = _pub_field("AR • Link", height=2)

def load_project(event=None):
    key = pro_selector.get()
    if not key:
        return

    en_pro = en_data.get("project", {}).get(key, {})
    ar_pro = ar_data.get("project", {}).get(key, {})

    # clear then fill
    for k in pro_fields:
        pro_fields[k].delete("1.0", "end")

    pro_fields["en_header"].insert("1.0", en_pro.get("header", ""))
    pro_fields["en_description"].insert("1.0", en_pro.get("description", ""))
    pro_fields["en_year"].insert("1.0", str(en_pro.get("year", "")))
    pro_fields["en_link"].insert("1.0", en_pro.get("link", ""))

    pro_fields["ar_header"].insert("1.0", ar_pro.get("header", ""))
    pro_fields["ar_description"].insert("1.0", ar_pro.get("description", ""))
    pro_fields["ar_year"].insert("1.0", str(ar_pro.get("year", "")))
    pro_fields["ar_link"].insert("1.0", ar_pro.get("link", ""))

pro_selector.bind("<<ComboboxSelected>>", load_project)


def _pro_keys(en_data):
    pass


def add_new_project():
    # Ensure publications containers exist
    en_data.setdefault("project", {}).setdefault("heading", en_data.get("project", {}).get("heading", "project"))
    ar_data.setdefault("project", {}).setdefault("heading", ar_data.get("project", {}).get("heading", "المشاريع"))

    new_key = _next_pub_key(en_data, ar_data)

    en_data["project"][new_key] = {
        "header": "",
        "description": "",
        "year": "",
        "link": ""
    }
    ar_data["project"][new_key] = {
        "header": "",
        "description": "",
        "year": "",
        "link": ""
    }

    # refresh selector values (prefer EN list)
    pro_selector["values"] = _pro_keys(en_data)
    pro_selector.set(new_key)
    load_project()

    messagebox.showinfo("New project", f"Created {new_key} (EN+AR). Fill fields then Save.")

def delete_project():
    key = pro_selector.get()
    if not key:
        messagebox.showerror("Error", "Select a project first.")
        return

    if not messagebox.askyesno("Confirm", f"Delete {key} from BOTH EN and AR?"):
        return

    if "project" in en_data and key in en_data["project"]:
        del en_data["project"][key]
    if "project" in ar_data and key in ar_data["project"]:
        del ar_data["project"][key]

    save_json(EN_PATH, en_data)
    save_json(AR_PATH, ar_data)

    pro_selector["values"] = _pro_keys(en_data)
    pro_selector.set("")

    for k in pro_fields:
        pro_fields[k].delete("1.0", "end")

    messagebox.showinfo("Deleted", f"{key} deleted from EN+AR.")

def save_project():
    key = pro_selector.get()
    if not key:
        messagebox.showerror("Error", "Select a project first.")
        return

    # save headings too
    en_data.setdefault("projects", {})
    ar_data.setdefault("projects", {})
    en_data["project"]["heading"] = pro_heading_en.get("1.0", "end").strip()
    ar_data["project"]["heading"] = pro_heading_ar.get("1.0", "end").strip()

    # ensure objects exist
    en_data["project"].setdefault(key, {})
    ar_data["project"].setdefault(key, {})

    en_data["project"][key]["header"] = pro_fields["en_header"].get("1.0", "end").strip()
    en_data["project"][key]["description"] = pro_fields["en_description"].get("1.0", "end").strip()
    en_data["project"][key]["year"] = pro_fields["en_year"].get("1.0", "end").strip()
    en_data["project"][key]["link"] = pro_fields["en_link"].get("1.0", "end").strip()

    ar_data["project"][key]["header"] = pro_fields["ar_header"].get("1.0", "end").strip()
    ar_data["project"][key]["description"] = pro_fields["ar_description"].get("1.0", "end").strip()
    ar_data["project"][key]["year"] = pro_fields["ar_year"].get("1.0", "end").strip()
    ar_data["project"][key]["link"] = pro_fields["ar_link"].get("1.0", "end").strip()

    save_json(EN_PATH, en_data)
    save_json(AR_PATH, ar_data)
    messagebox.showinfo("Saved", f"{key} updated in EN+AR.")

# ---- action buttons row
pro_actions = ttk.Frame(frame_pubs)
pro_actions.pack(fill="x", padx=10, pady=12)

tk.Button(pro_actions, text="+ Add New project", command=add_new_project).pack(side="left", padx=(0, 8))
tk.Button(pro_actions, text="Delete project", fg="red", command=delete_project).pack(side="left", padx=(0, 8))
tk.Button(pro_actions, text="Save project", command=save_project).pack(side="left")

# ---- init selector list
pro_selector["values"] = _pro_keys(en_data)
if _pro_keys(en_data):
    pro_selector.set(_pro_keys(en_data)[0])
    load_project()


# ======================================================================
#   FIXED BOTTOM BAR + BUILD BUTTON
# ======================================================================

def run_build():
    try:
        result = subprocess.run(
            ["npm", "run", "build"],
            capture_output=True,
            text=True,
            check=True
        )
        messagebox.showinfo("Build", "Build finished successfully.")
    except subprocess.CalledProcessError as e:
        err = (e.stderr or str(e)).strip()
        if len(err) > 2000:
            err = err[-2000:]
        messagebox.showerror("Build Failed", err if err else "Unknown build error.")
    except FileNotFoundError:
        messagebox.showerror("Build Failed", "npm not found. Please install Node.js/npm and try again.")

bottom_bar = ttk.Frame(root, padding=(10, 8))
bottom_bar.grid(row=1, column=0, sticky="ew")
bottom_bar.grid_columnconfigure(0, weight=1)

build_btn = tk.Button(bottom_bar, text="Run Build", bg="green", fg="white", command=run_build)
build_btn.grid(row=0, column=0, sticky="e")


# ======================================================================
#   START APP
# ======================================================================

root.mainloop()