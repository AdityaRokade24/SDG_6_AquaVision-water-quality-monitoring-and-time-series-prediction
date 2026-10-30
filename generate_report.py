import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Sets background shading of a docx table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets padding/margins for table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()

    # Define standard page margins (0.75 in)
    sections = doc.sections
    for s in sections:
        s.top_margin = Inches(0.8)
        s.bottom_margin = Inches(0.8)
        s.left_margin = Inches(0.8)
        s.right_margin = Inches(0.8)

    # Color Palette Constants
    PRIMARY_HEX = "0D3B66"      # Deep Royal Blue
    SECONDARY_HEX = "00A896"    # Vibrant Teal
    ACCENT_HEX = "F4A261"       # Muted Gold / Amber
    DARK_BG_HEX = "030712"      # Slate Dark
    LIGHT_BG_HEX = "F4F6F9"     # Crisp Light Gray
    BORDER_HEX = "CBD5E1"       # Soft border

    # Base Style Config
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x33, 0x41, 0x55) # Slate 700
    normal_style.paragraph_format.line_spacing = 1.2
    normal_style.paragraph_format.space_after = Pt(6)

    # Helper for adding styled headings
    def add_custom_heading(text, level, space_before=14, space_after=6):
        h = doc.add_heading(level=level)
        h.paragraph_format.space_before = Pt(space_before)
        h.paragraph_format.space_after = Pt(space_after)
        h.paragraph_format.keep_with_next = True
        run = h.add_run(text)
        run.bold = True
        if level == 1:
            run.font.size = Pt(18)
            run.font.color.rgb = RGBColor(0x0D, 0x3B, 0x66) # Deep Blue
            # Bottom border / divider line
            pPr = h._p.get_or_add_pPr()
            pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="12" w:space="4" w:color="00A896"/></w:pBdr>')
            pPr.append(pBdr)
        elif level == 2:
            run.font.size = Pt(14)
            run.font.color.rgb = RGBColor(0x00, 0x80, 0x80) # Teal
        elif level == 3:
            run.font.size = Pt(12)
            run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B) # Slate 800
        return h

    # Helper for callout boxes
    def add_callout(text, title=None, border_color="00A896", bg_color="F0FDFA"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.8)
        set_cell_background(cell, bg_color)
        set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
        
        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="none"/>
                <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>
                <w:bottom w:val="none"/>
                <w:right w:val="none"/>
            </w:tcBorders>
        ''')
        tcPr.append(tcBorders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        if title:
            r_title = p.add_run(f"{title}\n")
            r_title.bold = True
            r_title.font.size = Pt(11)
            r_title.font.color.rgb = RGBColor(0x0D, 0x3B, 0x66)
        r_text = p.add_run(text)
        r_text.font.size = Pt(10.5)
        r_text.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        
        # Add small spacing after table
        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_before = Pt(4)
        p_after.paragraph_format.space_after = Pt(4)

    # Helper for adding image with caption
    def add_captioned_image(img_path, caption_text, figure_num, width_in=6.2):
        if not os.path.exists(img_path):
            p = doc.add_paragraph(f"[Image file not found: {img_path}]")
            p.runs[0].font.color.rgb = RGBColor(0xFF, 0x00, 0x00)
            return

        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(width_in))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(0)
        p_cap.paragraph_format.space_after = Pt(12)
        r_num = p_cap.add_run(f"Figure {figure_num}: ")
        r_num.bold = True
        r_num.font.size = Pt(9.5)
        r_num.font.color.rgb = RGBColor(0x0D, 0x3B, 0x66)
        r_txt = p_cap.add_run(caption_text)
        r_txt.italic = True
        r_txt.font.size = Pt(9.5)
        r_txt.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    # -------------------------------------------------------------
    # COVER / HEADER TITLE BLOCK
    # -------------------------------------------------------------
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(20)
    title_p.paragraph_format.space_after = Pt(4)
    run_sub1 = title_p.add_run("UN SDG-6 RESEARCH & TECHNICAL IMPLEMENTATION REPORT\n")
    run_sub1.font.size = Pt(10.5)
    run_sub1.font.bold = True
    run_sub1.font.color.rgb = RGBColor(0x00, 0xA8, 0x96) # Teal

    run_title = title_p.add_run("AquaVision Prayagraj Sangam\n")
    run_title.font.size = Pt(26)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x0D, 0x3B, 0x66) # Deep Blue

    run_sub2 = title_p.add_run("Autonomous Multi-Agent AI System for Sacred River Confluence Telemetry, Machine Learning Predictive Analytics, and Public Ecological Safeguarding")
    run_sub2.font.size = Pt(14)
    run_sub2.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    # Metadata Table
    meta_tbl = doc.add_table(rows=4, cols=2)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Target Study Area:", "Prayagraj Triveni Sangam (Confluence of River Ganga, River Yamuna & Saraswati)"),
        ("Dataset Dimensions:", "46,528 Continuous IoT Telemetry Observations × 8 Physicochemical Attributes"),
        ("Analytics & ML Platform:", "Google Colab (Data Cleaning, Plausibility Filtering, Heatmap Correlation Analysis)"),
        ("Application System:", "4-Agent Decision Support Pipeline & Public Water Tester (React 19, Vite, Supabase)")
    ]
    for row_idx, (k, v) in enumerate(meta_data):
        c0 = meta_tbl.cell(row_idx, 0)
        c1 = meta_tbl.cell(row_idx, 1)
        c0.width = Inches(2.2)
        c1.width = Inches(4.6)
        set_cell_background(c0, "F8FAFC")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, top=60, bottom=60, left=100, right=100)
        set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(k)
        r0.bold = True
        r0.font.size = Pt(10)
        r0.font.color.rgb = RGBColor(0x0D, 0x3B, 0x66)
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(v)
        r1.font.size = Pt(10)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECTION 1: EXECUTIVE SUMMARY & PROBLEM STATEMENT
    # -------------------------------------------------------------
    add_custom_heading("1. Executive Summary & Problem Statement", level=1)
    
    p = doc.add_paragraph(
        "The Triveni Sangam in Prayagraj, India—the sacred confluence of the Ganga, Yamuna, and mythical underground Saraswati—represents one of the most culturally vital and ecologically sensitive freshwater ecosystems in the world. As the site of massive religious gatherings including the annual Magh Mela and the Maha Kumbh Mela (drawing between 100 million and 240 million pilgrims), the river confluence experiences extraordinary anthropogenic pressure. Millions of pilgrims perform sacred ritual immersions ('Snan'), offering flowers, milk, and organic materials directly into the water within compressed temporal windows."
    )
    
    add_custom_heading("1.1 The Critical Problem in River Water Monitoring", level=2)
    p = doc.add_paragraph(
        "Historically, river water quality assessment across the Ganga basin has relied upon manual grab sampling conducted by regulatory bodies such as the Central Pollution Control Board (CPCB) and State Pollution Control Boards (SPCBs). While chemically precise, this conventional methodology suffers from fatal systematic handicaps in mass-pilgrimage and dynamic river environments:"
    )
    
    bullet_points = [
        ("Severe Incubation Latency (24 to 72 Hours): ", "Standard parameters like Biochemical Oxygen Demand (BOD5) and Fecal Coliform require multiday microbiological incubation. By the time water is confirmed to be dangerously contaminated or unfit for human contact, tens of millions of bathers have already entered the water, risking waterborne infections, dermatitis, and systemic gastroenteritis."),
        ("Blindness to Diurnal Hypoxic Inversions: ", "Rivers experience extreme photosynthetic diurnal cycles. Oxygen levels peak during midday sunlight due to algal photosynthesis and plunge dangerously at 03:00–05:00 AM due to continuous microbial and aquatic respiration. Because manual samples are typically gathered during daylight office hours (10:00 AM to 04:00 PM), severe nocturnal and pre-dawn hypoxia (DO < 3.5 mg/L) goes completely undetected—precisely when orthodox pilgrims perform the most auspicious 'Brahma Muhurta' holy dips."),
        ("Lack of Predictive Foresight: ", "Grab sampling is strictly retrospective; it documents historical water conditions but cannot predict the downstream impact of upstream canal releases, heavy pilgrim surges, or sudden industrial effluents.")
    ]
    for b_title, b_desc in bullet_points:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_bt = bp.add_run(b_title)
        r_bt.bold = True
        r_bt.font.color.rgb = RGBColor(0x0D, 0x3B, 0x66)
        bp.add_run(b_desc)

    add_callout(
        "The core imperative of this project is to eliminate the 48-hour diagnostic lag through high-frequency IoT sensor telemetry, rigorous Google Colab data science validation, and an autonomous multi-agent AI system (AquaVision) that predicts water quality 24 hours and 7 days in advance while generating automated mitigation directives for administrators and safe-bathing guidance for citizens.",
        title="Project Mission & SDG-6 Commitment"
    )

    # -------------------------------------------------------------
    # SECTION 2: DATASET PROVENANCE & TECHNICAL SPECIFICATION
    # -------------------------------------------------------------
    add_custom_heading("2. Dataset Provenance & In-Depth Technical Specification", level=1)
    
    p = doc.add_paragraph(
        "To build a realistic, scientifically grounded predictive engine, this project utilizes continuous surface water quality telemetry collected from continuous IoT monitoring stations deployed along the River Ganga and Yamuna river reach at Prayagraj. The dataset captures real sensor readings recorded during the 2019 Kumbh Mela and throughout the following annual hydrological cycle."
    )
    
    add_custom_heading("2.1 Dataset Identity & Dimensionality", level=2)
    p = doc.add_paragraph(
        "The raw dataset comprises exactly 46,528 continuous telemetry observations across 8 distinct columns. As shown in the Google Colab analysis environment (Figure 1), the dataset captures minute-level and hourly sensor telemetry spanning from January 12, 2019 (commencement of the 2019 Prayagraj Kumbh Mela) through early 2020."
    )

    # Embed Colab Image 1 (media_1792223885896.png)
    colab_img1 = r"C:\Users\ADITYA\.gemini\antigravity-ide\brain\383de569-80cb-4dbe-a4ec-665f87f5b058\.user_uploaded\media_1792223885896.png"
    add_captioned_image(
        colab_img1,
        "Google Colab inspection output showing the raw dataset shape of (46528, 8) and initial DataFrame head records logged from January 12, 2019.",
        figure_num=1
    )

    add_custom_heading("2.2 Comprehensive Attribute Dictionary & Standards", level=2)
    p = doc.add_paragraph(
        "The 8 features recorded in the dataset represent the primary physical, chemical, and electrochemical parameters necessary to determine surface water health according to Central Pollution Control Board (CPCB) Class B standards for outdoor bathing:"
    )

    # Schema Table
    schema_tbl = doc.add_table(rows=9, cols=5)
    schema_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Feature", "Full Scientific Name", "Units", "Typical Range", "CPCB Class B Standard Threshold"]
    
    # Header row
    for col_idx, text in enumerate(headers):
        c = schema_tbl.cell(0, col_idx)
        set_cell_background(c, "0D3B66")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(text)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    schema_rows = [
        ("Date", "Observation Timestamp", "YYYY-MM-DD HH:MM:SS", "Jan 2019 – Jan 2020", "Temporal Index for Time-Series Analysis"),
        ("DO", "Dissolved Oxygen", "mg/L (ppm)", "1.5 – 14.0", "≥ 5.0 mg/L (Mandatory for sacred bathing)"),
        ("pH", "Potential of Hydrogen", "pH scale (0-14)", "6.5 – 9.0 (Raw spikes to 12.9)", "6.5 – 8.5 (Neutral to slightly alkaline)"),
        ("ORP", "Oxidation-Reduction Potential", "V or mV", "-0.35 to +0.35 V", "≥ +0.25 V (+250 mV) indicates oxidizing power"),
        ("Cond", "Electrical Conductivity", "mS/cm or µS/cm", "0.04 – 55.0 mS/cm", "< 500 µS/cm (< 0.5 mS/cm) for fresh river water"),
        ("Temp", "Water Temperature", "°C", "17.0 – 30.5 °C", "Ambient River Range (18 – 25 °C optimal)"),
        ("WQI", "Water Quality Index", "Score (0 - 100)", "15.0 – 95.0", "≥ 65 = Good, ≥ 80 = Excellent/Safe"),
        ("Status", "Categorical Classification", "String Label", "Very Poor to Good", "CPCB Suitability ('Safe' / 'Bathing Fit')")
    ]

    for row_idx, data_tuple in enumerate(schema_rows, start=1):
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, val in enumerate(data_tuple):
            c = schema_tbl.cell(row_idx, col_idx)
            set_cell_background(c, bg)
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)
            p = c.paragraphs[0]
            r = p.add_run(val)
            r.font.size = Pt(9)
            if col_idx == 0:
                r.bold = True
                r.font.color.rgb = RGBColor(0x0D, 0x3B, 0x66)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # -------------------------------------------------------------
    # SECTION 3: DATA CLEANING, PREPROCESSING & EDA (GOOGLE COLAB)
    # -------------------------------------------------------------
    add_custom_heading("3. Data Cleaning, Preprocessing & Exploratory Analysis on Google Colab", level=1)
    
    p = doc.add_paragraph(
        "Raw IoT buoy telemetry in natural riverine settings is inherently vulnerable to transmission packet loss, sensor biofouling, electrochemical drift, and calibration dropouts. To ensure that the machine learning models and automated diagnostic agents receive sound physical inputs, an extensive data cleaning and exploratory data analysis (EDA) pipeline was conducted in Google Colab."
    )

    add_custom_heading("3.1 Preprocessing & Anomaly Filtering Workflow", level=2)
    colab_steps = [
        ("Datetime Standardization & Temporal Resampling: ", "The timestamp column was parsed into UTC+5:30 (Indian Standard Time) datetime objects, sorted chronologically, and indexed to establish a clean sequential basis for 24-hour and 7-day rolling horizons."),
        ("Physical Boundary Validation & Biofouling Removal: ", "Raw data inspection revealed unphysical extreme sensor anomalies—such as pH readings reaching 12.99 and ORP crashing to -0.35 V (evident in Figure 1 and Figure 2). In a freshwater river like the Ganga, pH > 10.5 or ORP < -0.30 V represents temporary electrode fouling or short circuits during sediment churning. These erroneous records were filtered and imputed using forward/backward EWMA (Exponentially Weighted Moving Average)."),
        ("Handling Missing Telemetry Packets: ", "Sensor transmission gaps caused by cellular network dropouts during peak Kumbh Mela crowding were repaired using linear interpolation for gaps < 2 hours and seasonal diurnal median imputation for prolonged disconnects.")
    ]
    for s_title, s_desc in colab_steps:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_st = bp.add_run(s_title)
        r_st.bold = True
        r_st.font.color.rgb = RGBColor(0x0D, 0x3B, 0x66)
        bp.add_run(s_desc)

    add_custom_heading("3.2 Longitudinal Time-Series Analysis: Temperature & ORP", level=2)
    p = doc.add_paragraph(
        "Figure 2 illustrates the cleaned longitudinal time-series signals for water Temperature and Oxidation-Reduction Potential (ORP) across the full annual cycle from January 2019 to January 2020:"
    )

    # Embed Colab Image 2 (media_1792224045793.png)
    colab_img2 = r"C:\Users\ADITYA\.gemini\antigravity-ide\brain\383de569-80cb-4dbe-a4ec-665f87f5b058\.user_uploaded\media_1792224045793.png"
    add_captioned_image(
        colab_img2,
        "Google Colab time-series visualizations of cleaned Temperature (°C) and ORP (V) over the 2019–2020 annual observation cycle, displaying seasonal trends and post-cleaning signal stability.",
        figure_num=2
    )

    p = doc.add_paragraph(
        "Key scientific insights extracted from the cleaned time-series in Figure 2 include:\n"
        "1. Temperature Seasonality: Water temperature ranges from a winter low of 18.0 °C in January 2019 (during the peak of Kumbh bathing) to a summer peak approaching 30.0 °C in June/July 2019, followed by a steady drop back to 22.0 °C by December 2019.\n"
        "2. ORP Dynamics & Self-Purification Capacity: The river maintains an average ORP between +0.10 V and +0.18 V under normal flow conditions, indicating positive oxidizing capacity. Sharp downward spikes coincide with intense bathing days and post-monsoon organic discharges, briefly depressing the river's self-cleansing redox potential before re-aeration restores the equilibrium."
    )

    add_custom_heading("3.3 Multi-Parameter Correlation Analysis & Hydro-Chemical Discoveries", level=2)
    p = doc.add_paragraph(
        "To quantify the statistical and physical relationships between the monitoring parameters, a Pearson correlation matrix was computed and visualized as a heatmap in Google Colab (Figure 3):"
    )

    # Embed Colab Image 3 (media_1792224057833.png)
    colab_img3 = r"C:\Users\ADITYA\.gemini\antigravity-ide\brain\383de569-80cb-4dbe-a4ec-665f87f5b058\.user_uploaded\media_1792224057833.png"
    add_captioned_image(
        colab_img3,
        "Correlation matrix heatmap computed across pH, Dissolved Oxygen (DO), Temperature, and Oxidation-Reduction Potential (ORP), revealing critical thermodynamic and biochemical couplings.",
        figure_num=3
    )

    # Correlation breakdown table
    corr_tbl = doc.add_table(rows=5, cols=4)
    corr_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    corr_headers = ["Parameter Pair", "Pearson r", "Significance Level", "Scientific / Environmental Explanation"]
    for col_idx, text in enumerate(corr_headers):
        c = corr_tbl.cell(0, col_idx)
        set_cell_background(c, "0D3B66")
        set_cell_margins(c, top=70, bottom=70, left=90, right=90)
        p = c.paragraphs[0]
        r = p.add_run(text)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    corr_data = [
        ("DO vs. Temperature", "-0.94", "Extremely Strong Negative", "Governed by Henry's Law of gas solubility: cold winter water holds dramatically more dissolved oxygen (~12-14 mg/L) than warm summer water (~6-7 mg/L)."),
        ("pH vs. DO", "+0.44", "Moderate Positive", "Photosynthetic algal activity consumes dissolved carbon dioxide (carbonic acid), driving pH up while simultaneously liberating dissolved oxygen."),
        ("pH vs. Temperature", "-0.39", "Moderate Negative", "Higher water temperatures accelerate biological decay and respiratory production of CO2, lowering pH toward acidic ranges."),
        ("pH vs. ORP", "-0.35", "Moderate Negative", "Electrochemical Nernstian relationship: as hydrogen ion concentration shifts (higher pH/alkalinity), the oxidation potential decreases systematically.")
    ]

    for row_idx, (pair, r_val, sig, expl) in enumerate(corr_data, start=1):
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, val in enumerate([pair, r_val, sig, expl]):
            c = corr_tbl.cell(row_idx, col_idx)
            set_cell_background(c, bg)
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)
            p = c.paragraphs[0]
            r = p.add_run(val)
            r.font.size = Pt(9)
            if col_idx == 0:
                r.bold = True
            elif col_idx == 1:
                r.bold = True
                r.font.color.rgb = RGBColor(0x00, 0xA8, 0x96) if "-" not in val or float(val) > -0.5 else RGBColor(0xD9, 0x04, 0x29)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # -------------------------------------------------------------
    # SECTION 4: PROPOSED SOLUTION: AQUAVISION MULTI-AGENT AI SYSTEM
    # -------------------------------------------------------------
    add_custom_heading("4. Proposed Solution: The AquaVision Multi-Agent AI System", level=1)
    
    p = doc.add_paragraph(
        "To transform the statistical models and telemetry insights into an autonomous operational platform, we architected AquaVision—a specialized 4-agent collaborative AI pipeline dedicated to the Prayagraj Triveni Sangam ecosystem. Each agent performs a dedicated role in the perception-diagnosis-forecasting-mitigation hierarchy:"
    )

    agent_descriptions = [
        ("Agent 1: Telemetry Acquisition & Preprocessing: ", "Ingests live telemetry from floating IoT buoys and ghat stations, performs real-time plausibility thresholding, smooths sensor noise, and maintains continuous baseline synchronization across Ganga, Yamuna, and Sangam reaches."),
        ("Agent 2: Diagnostic Evaluation & CPCB Bathing Index: ", "Executes the Weighted Arithmetic Water Quality Index (WQI) calculation. Compares each parameter against CPCB Class B standards, detects violation margins, and classifies water into actionable safety grades (A: Pristine, B: Safe for Bathing, C: Moderate, D: Poor, E: Unfit)."),
        ("Agent 3: ML Time-Series Forecaster: ", "Projects river health across two horizons: a 24-hour Diurnal Hourly Model that accounts for daylight solar radiation and pre-dawn respiratory DO dips, and a 7-day Longitudinal Trend Model calibrated to upstream dam discharges (Narora/Tehri reservoirs) with confidence bounds."),
        ("Agent 4: Autonomous Risk Advisory & Remediation Directives: ", "Evaluates the combined diagnostic and forecasting matrix to classify risk (Low, Moderate, High, Critical). Generates automated field directives including artificial aeration activation, interceptor drain diversions to STPs, upstream reservoir flushing orders, and public bathing safety notices.")
    ]
    for a_title, a_desc in agent_descriptions:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_at = bp.add_run(a_title)
        r_at.bold = True
        r_at.font.color.rgb = RGBColor(0x0D, 0x3B, 0x66)
        bp.add_run(a_desc)

    add_callout(
        "Mathematical Formulation of CPCB Water Quality Index:\n"
        "WQI = Σ (w_i × q_i) / Σ w_i\n"
        "Where w_i is the assigned parameter unit weight (DO: 0.30, BOD: 0.25, pH: 0.15, Turbidity: 0.10, Conductivity: 0.10, Temp: 0.05, ORP: 0.05), and q_i is the sub-index quality rating reflecting deviation from ideal pure water standards.",
        title="CPCB WQI Weighted Arithmetic Algorithm"
    )

    # -------------------------------------------------------------
    # SECTION 5: FRONTEND WEB APPLICATION & VISUAL WALKTHROUGH
    # -------------------------------------------------------------
    add_custom_heading("5. Frontend Web Application Architecture & Visual Walkthrough", level=1)
    
    p = doc.add_paragraph(
        "The frontend system is engineered as a responsive, modern web application built using React 19, Vite, Tailwind CSS, Lucide Icons, and Recharts, connected to a Supabase cloud telemetry database. The interface is purposefully designed with dual functionality: an advanced multi-agent dashboard for scientific and regulatory users, and a simplified public water tester for pilgrims and citizens."
    )

    add_custom_heading("5.1 Multi-Agent AI Pipeline Dashboard (Figure 4)", level=2)
    p = doc.add_paragraph(
        "Figure 4 showcases the primary operational dashboard of AquaVision Prayagraj Sangam:"
    )

    # Embed Frontend Image 1 (media_1792223559477.png)
    front_img1 = r"C:\Users\ADITYA\.gemini\antigravity-ide\brain\383de569-80cb-4dbe-a4ec-665f87f5b058\.user_uploaded\media_1792223559477.png"
    add_captioned_image(
        front_img1,
        "AquaVision 4-Agent Pipeline UI: Displays Agent 1 telemetry acquisition hero banner, Prayagraj Sangam IoT network status, live 1-click scan button, and stage-by-stage pipeline progress.",
        figure_num=4
    )

    p = doc.add_paragraph(
        "Key capabilities visible in the Multi-Agent Pipeline UI (Figure 4):\n"
        "• Stepper Progress Tracker: Clearly guides users through Acquisition → Analysis → Prediction → Risk Mitigation.\n"
        "• Instant 1-Click Live Scan: Directly queries live CPCB and Sangam buoy telemetry endpoints to fetch current water status in real time.\n"
        "• Interactive Parameter Simulator: Allows hydrologists to simulate pilgrimage influx surges, monsoon siltation, or upstream discharge adjustments to test agent response."
    )

    add_custom_heading("5.2 Public Water Quality Tester & File Upload Portal (Figure 5)", level=2)
    p = doc.add_paragraph(
        "To ensure democratized access to river water health, AquaVision features 'Today's Sangam Water Tester' (Figure 5), allowing anyone—from field volunteers to pilgrims—to test local water safety:"
    )

    # Embed Frontend Image 2 (media_1792223576083.png)
    front_img2 = r"C:\Users\ADITYA\.gemini\antigravity-ide\brain\383de569-80cb-4dbe-a4ec-665f87f5b058\.user_uploaded\media_1792223576083.png"
    add_captioned_image(
        front_img2,
        "Today's Sangam Water Tester & File Upload Portal: Intuitive citizen-science interface for manual physicochemical entry and bulk CSV/JSON telemetry file ingestion.",
        figure_num=5
    )

    p = doc.add_paragraph(
        "Features of the Public Water Tester (Figure 5):\n"
        "• Dual Input Modes: Users can either enter physical sensor values (pH, DO, BOD, Temp, EC, Turbidity, ORP) with real-time safety threshold badges or drag-and-drop raw CSV/JSON logs.\n"
        "• Instant Bathing Suitability Modal: Generates an instant CPCB grade, safety status, 24h oxygen fluctuation forecast, and downloadable CSV compliance report.\n"
        "• Cloud Persistence: Integrated with Supabase to log readings to the official Sangam Water Records repository."
    )

    # -------------------------------------------------------------
    # SECTION 6: REAL-WORLD UTILITY & ALIGNMENT WITH UN SDG-6
    # -------------------------------------------------------------
    add_custom_heading("6. Real-World Utility & Alignment with UN SDG-6", level=1)
    
    p = doc.add_paragraph(
        "AquaVision directly addresses multiple targets of United Nations Sustainable Development Goal 6 (Clean Water and Sanitation) and delivers tangible societal impact:"
    )

    sdg_items = [
        ("UN SDG-6 Target 6.3 (Water Quality Improvement): ", "By continuously detecting sewage effluent spikes (BOD > 5.0 mg/L) and industrial salinity surges, AquaVision enables prompt municipal enforcement, preventing untreated effluent discharge into sacred bathing reaches."),
        ("UN SDG-6 Target 6.6 (Protect Water Ecosystems): ", "Predictive pre-dawn dissolved oxygen monitoring safeguards the critically endangered Ganges River Dolphin (Platanista gangetica) and native carp species from asphyxiating nocturnal hypoxia."),
        ("Pilgrim Health & Epidemic Prevention: ", "Informing over 100 million bathers during Kumbh Mela prevents large-scale outbreaks of waterborne dysentery, typhoid, and infectious dermatological conditions."),
        ("Autonomous Municipal Decision Support: ", "Replaces bureaucratic delays with automated directives sent directly to irrigation engineers, sewage treatment plant (STP) operators, and the Prayagraj Mela Authority.")
    ]
    for s_title, s_desc in sdg_items:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_st = bp.add_run(s_title)
        r_st.bold = True
        r_st.font.color.rgb = RGBColor(0x0D, 0x3B, 0x66)
        bp.add_run(s_desc)

    # -------------------------------------------------------------
    # SECTION 7: CONCLUSION & FUTURE WORK
    # -------------------------------------------------------------
    add_custom_heading("7. Conclusion & Future Roadmap", level=1)
    p = doc.add_paragraph(
        "The AquaVision Prayagraj Sangam system bridges the divide between theoretical environmental data science and urgent public health protection. By validating 46,528 continuous telemetry observations in Google Colab, uncovering fundamental thermodynamic relationships (such as the -0.94 DO-Temperature correlation), and deploying an autonomous 4-agent AI pipeline paired with a modern public web application, this project establishes a scalable blueprint for smart sacred river management across India and the Global South."
    )
    p = doc.add_paragraph(
        "Future enhancements include integration with Sentinel-2 satellite multispectral imagery for basin-wide chlorophyll-a tracking, edge AI deployment directly onto solar-powered floating buoy hardware, and automated SMS early-warning broadcast integration with district disaster management authorities."
    )

    # Save document
    output_filename = "AquaVision_Sangam_Water_Quality_Comprehensive_Report.docx"
    doc.save(output_filename)
    print(f"Document successfully created and saved as: {output_filename}")

if __name__ == "__main__":
    create_document()
