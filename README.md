# Technical notes

The technique used to modify the anchor title attributes (tooltips) is very unobtrusive. The visit time and tooltip text are only looked up and modified when the cursor enters the anchor area and the original tooltip is restored immediately when the cursor leaves. Dynamically added anchors elements are discovered every 2 seconds (with a cache lookup to minimize already bound elements). The impact on page load time and performance should be very minimal.
