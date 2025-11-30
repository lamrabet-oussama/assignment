"use client";
// import { useState, useEffect } from "react";

// import UpgradeModal from "@/components/UpgradeModal";
// import UpgradeSuccessNotification from "@/components/UpgradeSuccessNotification";
import { useContactLimits } from "@/hooks/useContactLimits";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function UpgradePage() {
  // const [showModal, setShowModal] = useState(false);
  // const [showSuccess, setShowSuccess] = useState(false);
  const { count, limit, isLoading, refreshLimits } = useContactLimits();

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     window.confirmUpgrade = () => {
  //       setShowModal(false);
  //       setShowSuccess(true);
  //     };
  //   }
  // }, []);

  // Disable upgrade functionality - do nothing
  const handleUpgrade = async () => {
    // No action performed
  };


  const progressPercent = Math.min((count / limit) * 100, 100);
  let progressColor = "bg-blue-500";
  if (progressPercent > 75) progressColor = "bg-red-500";
  else if (progressPercent > 50) progressColor = "bg-orange-400";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-2xl hover:shadow-3xl rounded-3xl p-8 max-w-lg w-full transition-all duration-300 space-y-6">
        <h1 className="text-4xl font-bold text-blue-700 text-center">
          Contact Limits
        </h1>
        <p className="text-gray-700 text-center text-lg">
          Manage your daily contact viewing limits.
        </p>

        {/* Benefits List */}
        <ul className="space-y-3 text-gray-600">
          {[
            "Standard contact limit",
            "Access to all features",
            "Priority support (not applicable)",
            "Advanced analytics (not applicable)",
            "Export contact lists (not applicable)",
          ].map((item, idx) => (
            <li key={idx} className="flex items-start space-x-3">
              <CheckCircleIcon className="w-6 h-6 text-green-500 mt-0.5 shrink-0" />
              <span className="text-gray-800 font-medium">{item}</span>
            </li>
          ))}
        </ul>

        {/* Daily usage progress */}
        {!isLoading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Daily contact views</span>
              <span>
                {count}/{limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`${progressColor} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upgrade Button */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={handleUpgrade}
        >
          Upgrade Now
        </button>
      </div>

      {/* Modals removed: nothing is displayed after upgrade */}
    </div>
  );
}
