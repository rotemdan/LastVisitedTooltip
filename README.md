# Technical notes

The technique used to modify the anchor title attributes (tooltips) should be quite unobtrusive. History entries and tooltip text are only looked up and modified when the cursor enters the anchor area and the original tooltip is restored immediately when the cursor leaves. Dynamically added anchor elements are discovered every 1000ms (with a cache lookup to minimize already known elements). The impact on page load time and performance should be very minimal.
