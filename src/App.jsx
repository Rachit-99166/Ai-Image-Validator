// import React, { useEffect, useRef, useState } from "react";
// import "./index.css";

// export default function App() {
//   const [stage, setStage] = useState("home");
//   const [imageFile, setImageFile] = useState(null);
//   const [imageDataUrl, setImageDataUrl] = useState(null);
//   const [reason, setReason] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [aiResult, setAiResult] = useState(null);
//   const [notes, setNotes] = useState("");

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [usingCamera, setUsingCamera] = useState(false);

//   useEffect(() => {
//     return () => {
//       try {
//         const video = videoRef.current;
//         const tracks = video?.srcObject?.getTracks?.();
//         tracks?.forEach((t) => t.stop());
//       } catch (e) {
//       }
//     };
//   }, []);

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0] ?? null;
//     if (!file) return;
//     setImageFile(file);
//     const reader = new FileReader();
//     reader.onload = (ev) => setImageDataUrl(String(ev.target.result));
//     reader.readAsDataURL(file);
//     setAiResult(null);
//     setNotes("");
//   };

//   const startCamera = async () => {
//     setUsingCamera(true);
//     setAiResult(null);
//     setNotes("");
//     try {
//   const stream = await navigator.mediaDevices.getUserMedia({
//     video: {
//       facingMode: { ideal: "environment" },
//       width: { ideal: 1280 },
//       height: { ideal: 720 },
//     },
//     audio: false,
//   });

//   if (videoRef.current) {
//     videoRef.current.srcObject = stream;

//     videoRef.current.setAttribute("playsinline", "true");
//     videoRef.current.muted = true;

//     try {
//       await videoRef.current.play();
//     } catch (e) {
//     }
//   }
// } catch (err) {
//   console.error("camera error", err);
//   setNotes("Camera access blocked or not available on this device.");
//   setUsingCamera(false);
// }
//   };

//   const captureFromCamera = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas) return;
//     canvas.width = video.videoWidth || 1280;
//     canvas.height = video.videoHeight || 720;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
//     setImageDataUrl(dataUrl);
//     setUsingCamera(false);
//     const tracks = video.srcObject?.getTracks?.();
//     tracks?.forEach((t) => t.stop());
//     video.srcObject = null;
//     setAiResult(null);
//     setNotes("");
//   };

//   const processImageWithAi = () => {
//     if (!imageDataUrl) {
//       setNotes("Please upload or capture an image before processing.");
//       return;
//     }

//     setProcessing(true);
//     setAiResult(null);
//     setNotes("");

//     setTimeout(() => {
//       const lowerReason = String(reason).toLowerCase();
//       const reasons = [];
//       let eligible = true;

//       if (!reason || reason.trim().length < 5) {
//         reasons.push("Return reason is too short please provide more details.");
//         eligible = false;
//       }

//       if (String(imageDataUrl).length < 10000) {
//         reasons.push("Image looks low-resolution or blurry.");
//         eligible = false;
//       }

//       if (
//         lowerReason.includes("wrong item") ||
//         lowerReason.includes("not what i ordered") ||
//         lowerReason.includes("different")
//       ) {
//         reasons.push("Product mismatch noted: include order number or a picture of packing label.");
//       }

//       if (reasons.length === 0) reasons.push("No obvious issues detected. We can proceed with the return.");

//       setAiResult({ eligible, reasons });
//       setProcessing(false);
//     }, 900);
//   };

//   const resetForm = () => {
//     try {
//       const video = videoRef.current;
//       const tracks = video?.srcObject?.getTracks?.();
//       tracks?.forEach((t) => t.stop());
//       if (video) video.srcObject = null;
//     } catch (e) {}
//     setImageFile(null);
//     setImageDataUrl(null);
//     setReason("");
//     setAiResult(null);
//     setNotes("");
//     setUsingCamera(false);
//     setProcessing(false);
//   };

//   const ResultBadge = ({ eligible }) => (
//     <div className={`badge ${eligible ? "badge-yes" : "badge-no"}`}>
//       <svg viewBox="0 0 24 24" className="badge-icon" aria-hidden>
//         {eligible ? (
//           <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
//         ) : (
//           <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
//         )}
//       </svg>
//       <span>{eligible ? "Eligible for return" : "Not eligible"}</span>
//     </div>
//   );

//   return (
//     <div className="app-root">
//       {/* NAV */}
//       <header className="nav">
//         <div className="nav-inner">
//           <div className="brand">
//             <div className="bullseye" aria-hidden>
//               <svg viewBox="0 0 100 100" className="bull-svg">
//                 <circle cx="50" cy="50" r="50" fill="#fff" />
//                 <circle cx="50" cy="50" r="38" fill="#cc0000" />
//                 <circle cx="50" cy="50" r="22" fill="#fff" />
//                 <circle cx="50" cy="50" r="10" fill="#cc0000" />
//               </svg>
//             </div>
//             <div className="brand-text">
//               <div className="brand-name">Target</div>
//               <div className="brand-sub">Returns</div>
//             </div>
//           </div>

//           <div className="nav-links">
//             <button className="nav-link" onClick={() => { setStage("home"); resetForm(); }}>
//               Home
//             </button>
//             <button className="nav-link" onClick={() => alert("Orders page (demo)")}>
//               Orders
//             </button>
//             <button className="nav-cta" onClick={() => { setStage("form"); resetForm(); }}>
//               Start return
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="hero">
//         <div className="hero-inner">
//           <h1 className="hero-title">Return Damaged or Bad Product</h1>
//           <p className="hero-sub">Quickly check eligibility by uploading a photo of the item.</p>
//           <div className="hero-cta">
//             <button className="btn btn-white" onClick={() => { setStage("form"); resetForm(); }}>
//               Start return
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* MAIN (note: gap below header/hero) */}
//       <main className="main-wrap">
//         {stage === "home" && (
//           <section className="center-card">
//             <div className="grid">
//               <div className="left">
//                 <div className="card">
//                   <h2>Why use this?</h2>
//                   <ul>
//                     <li>Upload or capture a photo of the damaged/bad product to speed up the approval process.</li>
//                     <li>To ensure accurate refund decisions.</li>
//                     <li>To reduce back-and-forth communication.</li>
//                   </ul>
//                 </div>

//                 <div className="card mt">
//                   <h3>Start return process below</h3>
//                   <p>Click "Start return" to open the returns form.</p>
//                   <div style={{ marginTop: 14 }}>
//                     <button className="btn btn-red" onClick={() => { setStage("form"); resetForm(); }}>
//                       Start return
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <aside className="right">
//                 <div className="card small">
//                   <h4>Quick summary</h4>
//                   <p className="muted">This panel shows the AI validator output and guidance for the next steps.</p>
//                   <p className="muted small">No results yet. Click <strong>Start return</strong> to upload a photo and begin.</p>
//                 </div>
//               </aside>
//             </div>
//           </section>
//         )}

//         {stage === "form" && (
//           <section className="center-card">
//             <div className="form-grid">
//               <div className="form-left">
//                 <label className="label">Upload or capture image</label>

//                 <div className="uploader">
//                   <div className="uploader-actions">
//                     <label className="upload-btn">
//                       <input accept="image/*" type="file" onChange={handleFileChange} />
//                       Upload from device
//                     </label>
//                     <button className="btn-outline-red" onClick={startCamera}>
//                       Use camera
//                     </button>
//                     <button className="btn btn-white small" onClick={() => { setImageDataUrl(null); setImageFile(null); setAiResult(null); setNotes(""); }}>
//                       Clear
//                     </button>
//                   </div>

//                   {usingCamera && (
//                     <div className="camera-area">
//                       <video ref={videoRef} autoPlay playsInline muted className="video" />
//                       <div className="camera-controls">
//                         <button className="btn btn-red" onClick={captureFromCamera}>Capture</button>
//                         <button className="btn btn-white small" onClick={() => {
//                           const tracks = videoRef.current?.srcObject?.getTracks?.();
//                           tracks?.forEach((t) => t.stop());
//                           if (videoRef.current) videoRef.current.srcObject = null;
//                           setUsingCamera(false);
//                         }}>Cancel</button>
//                       </div>
//                     </div>
//                   )}

//                   {imageDataUrl ? (
//                     <div className="preview-row">
//                       <img alt="preview" src={imageDataUrl} className="preview-img" />
//                       <div className="preview-meta">
//                         <p className="muted">Preview and basic checks</p>
//                         <ul>
//                           <li>File size: approx {Math.round((String(imageDataUrl).length * 3) / 4 / 1024)} KB (simulated)</li>
//                           <li>Resolution: {String(imageDataUrl).includes("data:image") ? "detected" : "unknown"}</li>
//                           <li>Format: JPEG/PNG (client-side)</li>
//                         </ul>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="muted">No image selected. Use upload or camera to attach a photo of the product.</div>
//                   )}

//                   <canvas ref={canvasRef} style={{ display: "none" }} />
//                 </div>

//                 <div className="mt-16">
//                   <label className="label">Reason for return</label>
//                   <textarea className="textarea" value={reason} onChange={(e) => setReason(e.target.value)} placeholder='Explain what is wrong, e.g. "broken on arrival", "missing parts", "wrong item"...' />
//                 </div>

//                 <div className="form-actions">
//                   <button className="btn btn-red" disabled={processing} onClick={processImageWithAi}>
//                     {processing ? "Analysing..." : "Process image"}
//                   </button>
//                   <button className="btn btn-white" onClick={() => { setStage("home"); resetForm(); }}>
//                     Back
//                   </button>
//                   <div className="status">{processing ? "analysing image..." : aiResult ? (aiResult.eligible ? "Ready" : "Issues found") : "idle"}</div>
//                 </div>
//               </div>

//               <aside className="form-right">
//                 <div className="card small">
//                   <h4>Quick summary</h4>
//                   <p className="muted">This panel shows the AI validator output and guidance for the next steps.</p>

//                   {aiResult ? (
//                     <>
//                       <div style={{ marginTop: 12 }}>
//                         <ResultBadge eligible={!!aiResult.eligible} />
//                       </div>

//                       <div className="why">
//                         <p className="strong">Why</p>
//                         <ul>
//                           {Array.isArray(aiResult.reasons) &&
//                             aiResult.reasons.map((r, i) => <li key={i}>{String(r)}</li>)}
//                         </ul>
//                       </div>

//                       <div className="why">
//                         <p className="strong">Suggested actions</p>
//                         <ol>
//                           {!aiResult.eligible && <li key="retake">Retake a clearer photo (show damaged area closely).</li>}
//                           {aiResult.eligible && <li key="proceed">Proceed to create a return label in the next step (not in this demo).</li>}
//                           <li key="include">Include order number and packing label if mismatch reported.</li>
//                         </ol>
//                       </div>
//                     </>
//                   ) : (
//                     <p className="muted small">No results yet. Click <strong>Process image</strong> after uploading a photo and entering a reason.</p>
//                   )}

//                   {notes && <div className="note">Note: {String(notes)}</div>}
//                 </div>
//               </aside>
//             </div>

//             <div className="log mt-18">
//               <h4>Image processing log</h4>
//               <div className="log-box">
//                 <p>AI validator output will appear here after processing.</p>
//                 <div className="muted small">Timestamp: {new Date().toLocaleString()}</div>
//               </div>
//             </div>

//             <div className="form-footer">
//               <div className="muted">Need help? Contact Target Support or visit our returns policy page.</div>
//               <div className="footer-actions">
//                 <button className="btn btn-white small" onClick={() => { try { navigator.clipboard?.writeText(window.location.href); } catch (e) {} }}>Copy Link</button>
//                 <button className="btn btn-white small" onClick={() => resetForm()}>Reset</button>
//               </div>
//             </div>
//           </section>
//         )}
//       </main>

//       {/* FOOTER */}
//       <footer className="site-footer">
//         <div className="footer-inner">
//           <div className="footer-brand">
//             <div className="bull-small" aria-hidden>
//               <svg viewBox="0 0 100 100" className="bull-small-svg">
//                 <circle cx="50" cy="50" r="50" fill="#fff" />
//                 <circle cx="50" cy="50" r="38" fill="#cc0000" />
//                 <circle cx="50" cy="50" r="22" fill="#fff" />
//                 <circle cx="50" cy="50" r="10" fill="#cc0000" />
//               </svg>
//             </div>
//             <div>
//               <div className="brand-name smallish">Target</div>
//               <div className="muted">Customer support</div>
//             </div>
//           </div>

//           <div className="muted">© {new Date().getFullYear()} Target Return UI</div>
//         </div>
//       </footer>
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import "./index.css";

export default function App() {
  const [stage, setStage] = useState("home");
  const [imageFile, setImageFile] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [notes, setNotes] = useState("");

  const [returnReason, setReturnReason] = useState("");
  const [tcin, setTcin] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImageDataUrl(String(ev.target.result));
    reader.readAsDataURL(file);
    setAiResult(null);
    setNotes("");
  };

  const processImageWithAi = () => {
    if (!imageDataUrl) {
      setNotes("Please upload an image before processing.");
      return;
    }

    setProcessing(true);
    setAiResult(null);
    setNotes("");

    setTimeout(() => {
      const lowerReason = String(reason).toLowerCase();
      const reasons = [];
      let eligible = true;

      if (!reason || reason.trim().length < 5) {
        reasons.push("Return reason is too short please provide more details.");
        eligible = false;
      }

      if (String(imageDataUrl).length < 10000) {
        reasons.push("Image looks low-resolution or blurry.");
        eligible = false;
      }

      if (
        lowerReason.includes("wrong item") ||
        lowerReason.includes("not what i ordered") ||
        lowerReason.includes("different")
      ) {
        reasons.push("Product mismatch noted: include order number or packing label.");
      }

      if (reasons.length === 0) reasons.push("No obvious issues detected. We can proceed with the return.");

      setAiResult({ eligible, reasons });
      setProcessing(false);
    }, 900);
  };

  const resetForm = () => {
    setImageFile(null);
    setImageDataUrl(null);
    setReason("");
    setAiResult(null);
    setNotes("");
    setProcessing(false);
    setReturnReason("");
    setTcin("");
  };

  const ResultBadge = ({ eligible }) => (
    <div className={`badge ${eligible ? "badge-yes" : "badge-no"}`}>
      <svg viewBox="0 0 24 24" className="badge-icon" aria-hidden>
        {eligible ? (
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        ) : (
          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        )}
      </svg>
      <span>{eligible ? "Eligible for return" : "Not eligible"}</span>
    </div>
  );

  return (
    <div className="app-root">
      <header className="nav">
        <div className="nav-inner">
          <div className="brand">
            <div className="bullseye" aria-hidden>
              <svg viewBox="0 0 100 100" className="bull-svg">
                <circle cx="50" cy="50" r="50" fill="#fff" />
                <circle cx="50" cy="50" r="38" fill="#cc0000" />
                <circle cx="50" cy="50" r="22" fill="#fff" />
                <circle cx="50" cy="50" r="10" fill="#cc0000" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-name">Target</div>
              <div className="brand-sub">Returns</div>
            </div>
          </div>

          <div className="nav-links">
            <button className="nav-link" onClick={() => { setStage("home"); resetForm(); }}>
              Home
            </button>
            <button className="nav-link" onClick={() => alert("Orders page (demo)")}>
              Orders
            </button>
            <button className="nav-cta" onClick={() => { setStage("form"); resetForm(); }}>
              Start return
            </button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Return Damaged or Bad Product</h1>
          <p className="hero-sub">Quickly check eligibility by uploading a photo of the item.</p>
          <div className="hero-cta">
            <button className="btn btn-white" onClick={() => { setStage("form"); resetForm(); }}>
              Start return
            </button>
          </div>
        </div>
      </section>

      <main className="main-wrap">

        {/* HOME PAGE */}
        {stage === "home" && (
          <section className="center-card">
            <div className="grid">
              <div className="left">
                <div className="card">
                  <h2>Why use this?</h2>
                  <ul>
                    <li>Upload a photo of the product to speed up approval.</li>
                    <li>Ensure accurate refund decisions.</li>
                    <li>Reduce communication steps.</li>
                  </ul>
                </div>

                <div className="card mt">
                  <h3>Start return process below</h3>
                  <p>Click "Start return" to open the returns form.</p>
                  <div style={{ marginTop: 14 }}>
                    <button className="btn btn-red" onClick={() => { setStage("form"); resetForm(); }}>
                      Start return
                    </button>
                  </div>
                </div>
              </div>

              <aside className="right">
                <div className="card small">
                  <h4>Quick summary</h4>
                  <p className="muted small">No results yet. Click <strong>Start return</strong> to begin.</p>
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* FORM PAGE */}
        {stage === "form" && (
          <section className="center-card">
            <div className="form-grid">
              <div className="form-left">
                <label className="label">Upload image</label>

                <div className="uploader">
                  <div className="uploader-actions">
                    <label className="upload-btn">
                      <input accept="image/*" type="file" onChange={handleFileChange} />
                      Upload from device
                    </label>

                    <button
                      className="btn btn-white small"
                      onClick={() => {
                        setImageDataUrl(null);
                        setImageFile(null);
                        setAiResult(null);
                        setNotes("");
                      }}
                    >
                      Clear
                    </button>
                  </div>

                  {imageDataUrl ? (
                    <div className="preview-row">
                      <img alt="preview" src={imageDataUrl} className="preview-img" />
                      <div className="preview-meta">
                        <p className="muted">Preview and basic checks</p>
                        <ul>
                          <li>File size: approx {Math.round((String(imageDataUrl).length * 3) / 4 / 1024)} KB</li>
                          <li>Resolution: detected</li>
                          <li>Format: JPEG/PNG</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="muted">No image selected. Use upload to attach a photo of the product.</div>
                  )}
                </div>

                {/* NEW DROPDOWN ADDED BELOW */}
                <div className="mt-16">
                  <label className="label">Return Reason:</label>
                  <select
                    className="dropdown"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                  >
                    <option value="">Select a reason</option>
                    <option>Damaged upon arrival</option>
                    <option>Doesn't work</option>
                    <option>Missing item</option>
                    <option>Quality not as expected</option>
                    <option>Wrong item received</option>
                    <option>Changed Mind</option>
                    <option>Expired or spoiled</option>
                  </select>
                </div>

                {/* ORIGINAL TEXTAREA */}
                <div className="mt-16">
                  <label className="label">Please provide more details</label>
                  <textarea
                    className="textarea"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder='Explain what is wrong, e.g. "broken on arrival", "missing parts", "wrong item"...'
                  />
                </div>

                {/* NEW TCIN INPUT BEFORE PROCESS IMAGE */}
                <div className="mt-16">
                  <label className="label">Tcin:</label>
                  <input
                    className="tcin-box"
                    type="text"
                    maxLength={100}
                    value={tcin}
                    onChange={(e) => setTcin(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Enter TCIN number"
                  />
                </div>

                <div className="form-actions">
                  <button className="btn btn-red" disabled={processing} onClick={processImageWithAi}>
                    {processing ? "Analysing..." : "Process image"}
                  </button>
                  <button className="btn btn-white" onClick={() => { setStage("home"); resetForm(); }}>
                    Back
                  </button>
                  <div className="status">{processing ? "analysing image..." : aiResult ? (aiResult.eligible ? "Ready" : "Issues found") : "idle"}</div>
                </div>
              </div>

              <aside className="form-right">
                <div className="card small">
                  <h4>Quick summary</h4>

                  {aiResult ? (
                    <>
                      <div style={{ marginTop: 12 }}>
                        <ResultBadge eligible={!!aiResult.eligible} />
                      </div>

                      <div className="why">
                        <p className="strong">Why</p>
                        <ul>
                          {aiResult.reasons.map((r, i) => (
                            <li key={i}>{String(r)}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="why">
                        <p className="strong">Suggested actions</p>
                        <ol>
                          {!aiResult.eligible && <li>Retake a clearer photo.</li>}
                          {aiResult.eligible && <li>Proceed to create return label.</li>}
                          <li>Include order number if mismatch reported.</li>
                        </ol>
                      </div>
                    </>
                  ) : (
                    <p className="muted small">No results yet. Click <strong>Process image</strong>.</p>
                  )}

                  {notes && <div className="note">Note: {String(notes)}</div>}
                </div>
              </aside>
            </div>

            <div className="log mt-18">
              <h4>Image processing log</h4>
              <div className="log-box">
                <p>AI validator output will appear here after processing.</p>
                <div className="muted small">Timestamp: {new Date().toLocaleString()}</div>
              </div>
            </div>

            <div className="form-footer">
              <div className="muted">Need help? Contact Target Support or visit our returns policy page.</div>
              <div className="footer-actions">
                <button
                  className="btn btn-white small"
                  onClick={() => {
                    try {
                      navigator.clipboard?.writeText(window.location.href);
                    } catch (e) {}
                  }}
                >
                  Copy Link
                </button>
                <button className="btn btn-white small" onClick={() => resetForm()}>
                  Reset
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="bull-small" aria-hidden>
              <svg viewBox="0 0 100 100" className="bull-small-svg">
                <circle cx="50" cy="50" r="50" fill="#fff" />
                <circle cx="50" cy="50" r="38" fill="#cc0000" />
                <circle cx="50" cy="50" r="22" fill="#fff" />
                <circle cx="50" cy="50" r="10" fill="#cc0000" />
              </svg>
            </div>
            <div>
              <div className="brand-name smallish">Target</div>
              <div className="muted">Customer support</div>
            </div>
          </div>

          <div className="muted">© {new Date().getFullYear()} Target Return UI</div>
        </div>
      </footer>
    </div>
  );
}
