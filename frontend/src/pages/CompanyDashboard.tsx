import React, { useState, useRef } from "react";
import Navbar from "../components/navbar";

// Receipt categories for verification
const RECEIPT_CATEGORIES = [
  "donation",
  "charity",
  "receipt",
  "payment",
  "purchase"
];

// Confidence threshold for passing
const CONFIDENCE_THRESHOLD = 0.7;

// Mock data for campaigns
const mockCampaigns = [
  {
    id: 1,
    title: "Clean Water Initiative",
    description: "Providing clean drinking water to rural communities",
    raised: 45000,
    goal: 75000,
    donors: 234,
    daysLeft: 18,
    image: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=400",
  },
  {
    id: 2,
    title: "Education for All",
    description: "Building schools in underserved areas",
    raised: 28500,
    goal: 50000,
    donors: 156,
    daysLeft: 25,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
  },
];

// Mock recent donations
const mockDonations = [
  { id: 1, donor: "Alex M.", amount: 500, campaign: "Clean Water Initiative", time: "2 min ago", txHash: "0x8f2e...3a1b", avatar: "A" },
  { id: 2, donor: "Sarah K.", amount: 150, campaign: "Education for All", time: "15 min ago", txHash: "0x3c4d...9e2f", avatar: "S" },
  { id: 3, donor: "Anonymous", amount: 1000, campaign: "Clean Water Initiative", time: "1 hour ago", txHash: "0x7b8a...4c5d", avatar: "?" },
  { id: 4, donor: "Michael R.", amount: 75, campaign: "Clean Water Initiative", time: "2 hours ago", txHash: "0x2d3e...8f9a", avatar: "M" },
  { id: 5, donor: "Emma L.", amount: 250, campaign: "Education for All", time: "3 hours ago", txHash: "0x9a1b...2c3d", avatar: "E" },
  { id: 6, donor: "James P.", amount: 100, campaign: "Clean Water Initiative", time: "5 hours ago", txHash: "0x4e5f...6a7b", avatar: "J" },
];

// Types for receipt analysis
interface AnalysisResult {
  passed: boolean;
  confidence: number;
  matched_categories: string[];
  missing_categories: string[];
  explanation: string;
}

function CompanyDashboard() {
  const totalRaised = mockCampaigns.reduce((sum, c) => sum + c.raised, 0);
  const totalDonors = mockCampaigns.reduce((sum, c) => sum + c.donors, 0);
  const activeCampaigns = mockCampaigns.length;

  // Receipt analyzer state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(2);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'passed' | 'failed'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setAnalysisResult(null);
      setAnalysisStatus('idle');
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setAnalysisResult(null);
      setAnalysisStatus('idle');
    }
  };

  // Analyze receipt
  const analyzeReceipt = async () => {
    if (!selectedFile || attemptsRemaining <= 0) return;

    setIsAnalyzing(true);
    setAnalysisStatus('analyzing');

    try {
      // Convert file to base64 for API
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);

      reader.onload = async () => {
        const base64Data = reader.result as string;

        try {
          const response = await fetch('http://localhost:8001/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              campaignId: 'receipt-verification',
              fileUrl: base64Data,
              categories: RECEIPT_CATEGORIES,
            }),
          });

          if (!response.ok) {
            throw new Error('Verification failed');
          }

          const result: AnalysisResult = await response.json();
          setAnalysisResult(result);

          // Check if passed based on confidence threshold
          if (result.confidence >= CONFIDENCE_THRESHOLD) {
            setAnalysisStatus('passed');
          } else {
            setAttemptsRemaining(prev => prev - 1);
            setAnalysisStatus('failed');
          }
        } catch (error) {
          console.error('Analysis error:', error);
          setAnalysisResult({
            passed: false,
            confidence: 0,
            matched_categories: [],
            missing_categories: RECEIPT_CATEGORIES,
            explanation: 'Failed to analyze receipt. Please try again.',
          });
          setAttemptsRemaining(prev => prev - 1);
          setAnalysisStatus('failed');
        } finally {
          setIsAnalyzing(false);
        }
      };
    } catch (error) {
      console.error('File read error:', error);
      setIsAnalyzing(false);
      setAnalysisStatus('failed');
    }
  };

  // Reset for retry
  const resetAnalysis = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setAnalysisResult(null);
    setAnalysisStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-fuchsia-500/15 to-rose-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <div className="relative z-10">
        {/* Main Content */}
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back! Here's your fundraising overview.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[
              { label: "Total Raised", value: `$${totalRaised.toLocaleString()}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
              { label: "Total Donors", value: totalDonors.toLocaleString(), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", gradient: "from-violet-500 to-fuchsia-500", shadow: "shadow-violet-500/20" },
              { label: "Active Campaigns", value: activeCampaigns, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
              { label: "Available to Withdraw", value: "$12,450", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", gradient: "from-sky-500 to-blue-500", shadow: "shadow-sky-500/20" },
            ].map((stat, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500`}></div>
                <div className="relative bg-slate-800/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-xl h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                      <p className="text-2xl lg:text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Campaigns Section */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-white">Your Campaigns</h2>

              {mockCampaigns.map((campaign) => {
  const progress = (campaign.raised / campaign.goal) * 100;

  return (
    <div key={campaign.id} className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-slate-700/50 hover:border-violet-500/30 transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Campaign Image */}
        <div className="md:w-48 h-48 md:h-auto bg-slate-700 flex-shrink-0 flex items-center justify-center">
          <svg
            className="w-14 h-14 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Campaign Info */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                {campaign.title}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {campaign.description}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              Active
            </span>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-white">
                ${campaign.raised.toLocaleString()} raised
              </span>
              <span className="text-slate-300">
                of ${campaign.goal.toLocaleString()}
              </span>
            </div>

            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {campaign.donors} donors
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {campaign.daysLeft} days left
            </div>

            <div className="flex items-center gap-2 text-emerald-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {Math.round(progress)}% funded
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})}

              {/* Receipt Analyzer Section */}
              <div className="mt-8">
                {/* Deadline Notice */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-amber-400 font-semibold text-sm">1 day left before receipts are due</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-4">Receipt Analyzer</h2>

                <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden">
                  <div className="p-6">
                    {/* Success State */}
                    {analysisStatus === 'passed' && (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Receipt Verified!</h3>
                        <p className="text-slate-400 mb-4">Your receipt has been successfully analyzed and approved.</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-lg">
                          <span className="text-emerald-400 font-semibold">Confidence: {analysisResult ? Math.round(analysisResult.confidence * 100) : 0}%</span>
                        </div>
                        {analysisResult && (
                          <div className="mt-4 text-left bg-slate-900/50 rounded-xl p-4">
                            <p className="text-sm text-slate-400 mb-2">Categories matched:</p>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.matched_categories.map((cat, i) => (
                                <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* No More Attempts State */}
                    {analysisStatus === 'failed' && attemptsRemaining <= 0 && (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
                          <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Verification Failed</h3>
                        <p className="text-slate-400 mb-4">You've used all your attempts. Please contact support for assistance.</p>
                        {analysisResult && (
                          <div className="mt-4 text-left bg-slate-900/50 rounded-xl p-4">
                            <p className="text-sm text-rose-400">{analysisResult.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Upload & Analyze State */}
                    {(analysisStatus === 'idle' || analysisStatus === 'analyzing' || (analysisStatus === 'failed' && attemptsRemaining > 0)) && (
                      <>
                        {/* Failed with retry available */}
                        {analysisStatus === 'failed' && attemptsRemaining > 0 && (
                          <div className="mb-6 p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                            <div className="flex items-start gap-3">
                              <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <div>
                                <p className="text-amber-400 font-semibold">Analysis didn't meet threshold</p>
                                <p className="text-amber-300/70 text-sm mt-1">
                                  You have <span className="font-bold">{attemptsRemaining} more {attemptsRemaining === 1 ? 'chance' : 'chances'}</span> to submit a valid receipt.
                                </p>
                                {analysisResult && (
                                  <p className="text-amber-300/60 text-sm mt-2">
                                    Previous confidence: {Math.round(analysisResult.confidence * 100)}% (needs {Math.round(CONFIDENCE_THRESHOLD * 100)}%)
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Category Tags */}
                        <div className="mb-6">
                          <p className="text-sm text-slate-400 mb-3">Verifying receipt categories:</p>
                          <div className="flex flex-wrap gap-2">
                            {RECEIPT_CATEGORIES.map((cat, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 bg-violet-500/20 text-violet-400 rounded-lg text-sm font-medium border border-violet-500/30"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Upload Area */}
                        <div
                          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                            filePreview
                              ? 'border-violet-500/50 bg-violet-500/10'
                              : 'border-slate-600 hover:border-violet-500/50 hover:bg-slate-700/30'
                          }`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />

                          {filePreview ? (
                            <div className="space-y-4">
                              <img
                                src={filePreview}
                                alt="Receipt preview"
                                className="max-h-48 mx-auto rounded-lg shadow-lg"
                              />
                              <p className="text-sm text-slate-400">{selectedFile?.name}</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  resetAnalysis();
                                }}
                                className="text-sm text-violet-400 hover:text-violet-300"
                              >
                                Choose different file
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="w-16 h-16 mx-auto rounded-full bg-slate-700 flex items-center justify-center">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-white font-medium">Upload your receipt</p>
                                <p className="text-sm text-slate-400 mt-1">Drag and drop or click to browse</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Analyze Button */}
                        <button
                          onClick={analyzeReceipt}
                          disabled={!selectedFile || isAnalyzing}
                          className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                            selectedFile && !isAnalyzing
                              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25'
                              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isAnalyzing ? (
                            <>
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Analyzing Receipt...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                              Analyze Receipt
                            </>
                          )}
                        </button>

                        {/* Attempts Counter */}
                        <div className="mt-4 text-center">
                          <span className="text-sm text-slate-500">
                            Attempts remaining: <span className={`font-semibold ${attemptsRemaining === 1 ? 'text-amber-400' : 'text-slate-400'}`}>{attemptsRemaining}</span>
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Donations</h2>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium">Live</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-slate-700/50">
                    <div className="divide-y divide-slate-700/50 max-h-[500px] overflow-y-auto">
                      {mockDonations.map((donation) => (
                        <div
                          key={donation.id}
                          className="p-4 hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {donation.avatar}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white truncate">
                                  {donation.donor}
                                </span>
                                <span className="text-emerald-400 font-bold">
                                  ${donation.amount}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 truncate">
                                {donation.campaign}
                              </p>
                            </div>

                            {/* Time */}
                            <span className="text-xs text-slate-400 flex-shrink-0">
                              {donation.time}
                            </span>
                          </div>

                          {/* Transaction Hash */}
                          <div className="mt-2 flex items-center gap-2">
                            <svg
                              className="w-3 h-3 text-slate-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                            <span className="text-xs font-mono text-slate-400">
                              {donation.txHash}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Link */}
                    <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
                      <button className="w-full text-center text-sm text-violet-400 font-medium hover:underline">
                        View All Transactions
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Withdraw Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 rounded-2xl opacity-30 blur-xl"></div>
                <div className="relative bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-violet-100 text-sm">Available Balance</p>
                      <p className="text-3xl font-bold text-white">$12,450</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-white text-violet-600 font-semibold hover:bg-violet-50 transition-colors">
                    Withdraw Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CompanyDashboard;
