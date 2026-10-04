import math
import os
import random
import struct
import wave

os.makedirs(r"C:\Users\hyun6\.gemini\antigravity\scratch\awakening-map\audio", exist_ok=True)
audio_dir = r"C:\Users\hyun6\.gemini\antigravity\scratch\awakening-map\audio"

SAMPLE_RATE = 22050
DURATION = 24.0 # 24 seconds seamless meditative loop
NUM_SAMPLES = int(SAMPLE_RATE * DURATION)

def write_wav(filename, samples):
    # Normalize samples to -0.95 .. 0.95
    max_val = max(abs(s) for s in samples) if samples else 1.0
    if max_val == 0: max_val = 1.0
    norm = [s / max_val * 0.9 for s in samples]
    
    # Apply fade in and fade out for seamless looping (2.0 seconds)
    fade_len = int(SAMPLE_RATE * 2.0)
    for i in range(fade_len):
        factor = i / fade_len
        norm[i] *= factor
        norm[-1 - i] *= factor

    filepath = os.path.join(audio_dir, filename)
    with wave.open(filepath, "w") as wav_file:
        wav_file.setnchannels(1) # mono
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(SAMPLE_RATE)
        
        raw_data = bytearray()
        for s in norm:
            val = int(max(-32767, min(32767, s * 32767)))
            raw_data.extend(struct.pack("<h", val))
        wav_file.writeframes(raw_data)
    print(f"Generated {filename}, size: {os.path.getsize(filepath)} bytes")

# ==============================================================================
# 1. BUDDHISM: Tibetan singing bowl, deep meditative drone, bansuri flute, temple ambiance
# ==============================================================================
print("Generating Buddhism audio...")
samples_buddha = [0.0] * NUM_SAMPLES

# A. Deep meditative Ohm drone at 108 Hz & 54 Hz with binaural beat
for i in range(NUM_SAMPLES):
    t = i / SAMPLE_RATE
    drone = 0.35 * math.sin(2 * math.pi * 108.0 * t) + \
            0.20 * math.sin(2 * math.pi * 108.6 * t) + \
            0.25 * math.sin(2 * math.pi * 54.0 * t) + \
            0.12 * math.sin(2 * math.pi * 216.0 * t)
    samples_buddha[i] += drone * (0.8 + 0.2 * math.sin(2 * math.pi * 0.08 * t))

# B. Tibetan singing bowl strikes (at t = 0.5s, 8.0s, 16.0s)
bowl_strikes = [0.5, 8.5, 16.5]
bowl_partials = [
    (216.0, 1.0, 6.0),    # fundamental, weight, decay_tau
    (596.2, 0.6, 5.0),    # partial 2 (2.76x)
    (1166.4, 0.35, 3.5),  # partial 3 (5.4x)
    (1922.4, 0.20, 2.2),  # partial 4 (8.9x)
]

for strike_t in bowl_strikes:
    start_idx = int(strike_t * SAMPLE_RATE)
    for i in range(start_idx, NUM_SAMPLES):
        delta_t = (i - start_idx) / SAMPLE_RATE
        for freq, weight, tau in bowl_partials:
            # beating overtone
            beat = 1.0 + 0.15 * math.sin(2 * math.pi * 1.8 * delta_t)
            amp = weight * math.exp(-delta_t / tau) * beat
            samples_buddha[i] += 0.45 * amp * math.sin(2 * math.pi * freq * delta_t)

# C. Bansuri bamboo flute (pentatonic meditation melody: D4, F4, G4, A4, C5, D5)
flute_notes = [
    (2.0, 4.0, 293.66), # D4
    (6.5, 4.0, 349.23), # F4
    (11.0, 3.5, 392.00),# G4
    (15.0, 4.0, 440.00),# A4
    (19.5, 4.0, 293.66) # D4 resolution
]

for note_start, note_dur, freq in flute_notes:
    start_i = int(note_start * SAMPLE_RATE)
    end_i = min(NUM_SAMPLES, start_i + int(note_dur * SAMPLE_RATE))
    total_len = end_i - start_i
    for idx in range(start_i, end_i):
        local_t = (idx - start_i) / SAMPLE_RATE
        # Envelope: soft attack, gentle sustain, soft release
        if local_t < 0.6:
            env = local_t / 0.6
        elif local_t > (note_dur - 0.8):
            env = max(0.0, (note_dur - local_t) / 0.8)
        else:
            env = 1.0
        
        # Vibrato (5 Hz LFO) + breath instability
        vib = 1.0 + 0.015 * math.sin(2 * math.pi * 4.8 * local_t)
        actual_freq = freq * vib
        
        # Flute harmonics (predominantly fundamental + soft 2nd & 3rd harmonic)
        tone = math.sin(2 * math.pi * actual_freq * local_t) + \
               0.35 * math.sin(2 * math.pi * actual_freq * 2 * local_t) + \
               0.15 * math.sin(2 * math.pi * actual_freq * 3 * local_t)
        
        # Breath air
        breath = 0.08 * (random.random() * 2 - 1)
        samples_buddha[idx] += 0.28 * env * (tone + breath)

write_wav("buddhism_zen_singing_bowl.wav", samples_buddha)

# ==============================================================================
# 2. CHRISTIANITY: Gregorian chant, solemn choir, cathedral reverb, monophonic, sacred acoustic
# ==============================================================================
print("Generating Christianity audio...")
samples_christian = [0.0] * NUM_SAMPLES

# Plainchant chant melody in Dorian mode (D3 -> F3 -> G3 -> A3 -> G3 -> F3 -> E3 -> D3)
# Formants for solemn monastic "Ooh" / "Aah" vocal timbre (F1~320Hz, F2~850Hz)
chant_phrases = [
    (1.0, 3.5, 146.83), # D3
    (4.8, 3.0, 174.61), # F3
    (8.0, 3.2, 196.00), # G3
    (11.5, 3.8, 220.00),# A3
    (15.5, 3.0, 196.00),# G3
    (18.8, 4.5, 146.83) # D3 resolve
]

# Continuous cathedral pedal note (D2 = 73.4 Hz)
for i in range(NUM_SAMPLES):
    t = i / SAMPLE_RATE
    pedal = 0.22 * math.sin(2 * math.pi * 73.42 * t) + \
            0.15 * math.sin(2 * math.pi * 146.83 * t) + \
            0.08 * math.sin(2 * math.pi * 220.24 * t)
    samples_christian[i] += pedal * (0.85 + 0.15 * math.sin(2 * math.pi * 0.12 * t))

# Synthesize choral chant with vocal formants and chorus effect
for phrase_start, phrase_dur, base_f in chant_phrases:
    s_idx = int(phrase_start * SAMPLE_RATE)
    e_idx = min(NUM_SAMPLES, s_idx + int(phrase_dur * SAMPLE_RATE))
    dur = (e_idx - s_idx) / SAMPLE_RATE
    
    for idx in range(s_idx, e_idx):
        lt = (idx - s_idx) / SAMPLE_RATE
        # Envelope: swell in and out like monks breathing together
        if lt < 0.8:
            env = math.sin(lt / 0.8 * (math.pi / 2))
        elif lt > (dur - 1.0):
            env = math.sin(max(0.0, (dur - lt) / 1.0) * (math.pi / 2))
        else:
            env = 1.0
            
        # Monastic vocal chorus (3 micro-detuned voices)
        voice1 = math.sin(2 * math.pi * base_f * lt)
        voice2 = math.sin(2 * math.pi * (base_f * 1.004) * lt)
        voice3 = math.sin(2 * math.pi * (base_f * 0.996) * lt)
        voice_oct = 0.45 * math.sin(2 * math.pi * (base_f * 2.0) * lt)
        
        # Vocal formant filter emphasis around 450Hz and 850Hz
        formant = 0.3 * math.sin(2 * math.pi * 440.0 * lt) + 0.2 * math.sin(2 * math.pi * 880.0 * lt)
        
        samples_christian[idx] += 0.40 * env * (voice1 + voice2 + voice3 + voice_oct + formant)

# Cathedral Reverb simulation (impulse delay feedback)
reverb_delays = [int(SAMPLE_RATE * d) for d in [0.08, 0.17, 0.29, 0.43, 0.65, 0.92, 1.35]]
reverb_decays = [0.35, 0.28, 0.22, 0.17, 0.12, 0.08, 0.05]

reverb_buf = [0.0] * NUM_SAMPLES
for d_samples, decay in zip(reverb_delays, reverb_decays):
    for i in range(d_samples, NUM_SAMPLES):
        reverb_buf[i] += samples_christian[i - d_samples] * decay

for i in range(NUM_SAMPLES):
    samples_christian[i] += reverb_buf[i] * 0.65

write_wav("christianity_gregorian_choir.wav", samples_christian)

# ==============================================================================
# 3. ISLAM: A cappella Nasheed, ambient ney flute, Arabic modal scales, soulful vocal drone, desert breeze
# ==============================================================================
print("Generating Islam audio...")
samples_islam = [0.0] * NUM_SAMPLES

# A. Desert breeze (pink/brown noise sweep with slow wind gust LFO)
wind_state = 0.0
for i in range(NUM_SAMPLES):
    t = i / SAMPLE_RATE
    white = random.random() * 2.0 - 1.0
    wind_state = 0.96 * wind_state + 0.04 * white # low pass filter
    # Wind gust modulation (0.07 Hz LFO)
    gust = (0.5 + 0.5 * math.sin(2 * math.pi * 0.07 * t)) ** 2
    samples_islam[i] += wind_state * gust * 0.18

# B. Soulful vocal drone (deep rich D2/A2 fifth drone with warm throat resonance)
for i in range(NUM_SAMPLES):
    t = i / SAMPLE_RATE
    vocal_drone = 0.25 * math.sin(2 * math.pi * 146.83 * t) + \
                  0.18 * math.sin(2 * math.pi * 220.00 * t) + \
                  0.10 * math.sin(2 * math.pi * 73.42 * t)
    # Slow natural breathing modulation
    breath_mod = 0.8 + 0.2 * math.sin(2 * math.pi * 0.15 * t)
    samples_islam[i] += vocal_drone * breath_mod

# C. Ambient Ney flute in Arabic Maqam Hijaz (D4, Eb4, F#4, G4, A4, Bb4, C5)
# Distinctive characteristic: augmented second between Eb and F#
hijaz_phrases = [
    (1.5, 3.8, 293.66), # D4
    (5.5, 2.5, 311.13), # Eb4
    (8.2, 4.0, 369.99), # F#4 (augmented second interval)
    (12.5, 3.5, 392.00),# G4
    (16.2, 3.2, 369.99),# F#4
    (19.6, 4.2, 293.66) # D4 tonic resolution
]

for p_start, p_dur, freq in hijaz_phrases:
    s_i = int(p_start * SAMPLE_RATE)
    e_i = min(NUM_SAMPLES, s_i + int(p_dur * SAMPLE_RATE))
    dur_s = (e_i - s_i) / SAMPLE_RATE
    
    for idx in range(s_i, e_i):
        lt = (idx - s_i) / SAMPLE_RATE
        if lt < 0.7:
            env = lt / 0.7
        elif lt > (dur_s - 0.9):
            env = max(0.0, (dur_s - lt) / 0.9)
        else:
            env = 1.0
            
        # Ney flute breathiness & warm reed flutter
        ornament = 1.0 + 0.018 * math.sin(2 * math.pi * 5.2 * lt)
        actual_f = freq * ornament
        
        # Hollow reed harmonics
        ney_tone = math.sin(2 * math.pi * actual_f * lt) + \
                   0.45 * math.sin(2 * math.pi * actual_f * 2 * lt) + \
                   0.25 * math.sin(2 * math.pi * actual_f * 3 * lt) + \
                   0.10 * math.sin(2 * math.pi * actual_f * 4 * lt)
        
        # Air breath turbulence
        reed_air = 0.12 * (random.random() * 2 - 1)
        samples_islam[idx] += 0.35 * env * (ney_tone + reed_air)

write_wav("islam_nasheed_ney_breeze.wav", samples_islam)
print("All audio files generated successfully!")
