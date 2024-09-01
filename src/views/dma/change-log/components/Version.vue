<template>
    <div class="version-wrapper">
        <div class="log-title">KOM 930E-4 HPI Dump Truck 4000 Hr Service</div>
        <div class="log-sub-title-panel">
            <div class="panel-icon">
                <span role="img" aria-label="Panel info" class="css-snhnyn" style="--icon-primary-color:currentColor; --icon-secondary-color:var(--ds-surface, #FFFFFF);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2C14.6522 2 17.1957 3.05357 19.0711 4.92893C20.9464 6.8043 22 9.34784 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22V22ZM12 11.375C11.6685 11.375 11.3505 11.5067 11.1161 11.7411C10.8817 11.9755 10.75 12.2935 10.75 12.625V15.75C10.75 16.0815 10.8817 16.3995 11.1161 16.6339C11.3505 16.8683 11.6685 17 12 17C12.3315 17 12.6495 16.8683 12.8839 16.6339C13.1183 16.3995 13.25 16.0815 13.25 15.75V12.625C13.25 12.2935 13.1183 11.9755 12.8839 11.7411C12.6495 11.5067 12.3315 11.375 12 11.375ZM12 9.96875C12.4558 9.96875 12.893 9.78767 13.2153 9.46534C13.5377 9.14301 13.7188 8.70584 13.7188 8.25C13.7188 7.79416 13.5377 7.35699 13.2153 7.03466C12.893 6.71233 12.4558 6.53125 12 6.53125C11.5442 6.53125 11.107 6.71233 10.7847 7.03466C10.4623 7.35699 10.2812 7.79416 10.2812 8.25C10.2812 8.70584 10.4623 9.14301 10.7847 9.46534C11.107 9.78767 11.5442 9.96875 12 9.96875Z" fill="currentColor"></path></svg></span>
            </div>
            <div class="panel-content">
                <p style="margin-bottom: 0px !important">Change Log</p>
            </div>
        </div>
        <h3 style="font-weight: bold">Version 1.0.1 (10 June 2023)</h3>
        <h4>Requested By : Ben Neill</h4>
        <h4>Requested Date : 5 June 2023</h4>
        <h4>Changes :</h4>
        <ul>
            <li><span style="font-weight: bold;">HV Alternator</span>
                <div class="mt-5">Task 153
                    <ul>
                        <li>Make photo mandatory for ALL ratings (A, B, C, and X)</li>
                    </ul>
                </div>
                <div>Task 154
                    <ul>
                        <li>Update wording to: Check brush holder condition and spacing.
                            <p><span style="font-weight: bold;">Spec:</span> Brush box – slip ring clearance = 2.4mm to 3.2mm</p>
                        </li>
                        <li>Insert a new task (task frequency to match current task 154) under 154 (called 155) with the below content. This will be a defect check with the ability to write the tension measured in.
Check tension of brush holder spring
                            <p><span style="font-weight: bold;">Spec:</span> 1.9 to 2.1 kilograms</p>
                        </li>
                    </ul>
                </div>
                <div>Task 156
                    <ul>
                        <li>Change from a defect identification check to an action check (complete, not applicable).</li>
                    </ul>
                </div>
            </li>
        </ul>
        <h3 style="font-weight: bold">Version 1.0.0 (31 May 2023)</h3>
        <ul>
            <li>Initial Version</li>
        </ul>
    </div>
</template>

<style scoped>
.log-title {
    font-size: 2.07143em;
    letter-spacing: -0.01em;
    line-height: 1.10345;
    font-weight: normal;
    margin-top: 0px;
    color: rgb(23, 43, 77);
}
.log-sub-title-panel {
    border-radius: 3px;
    margin: 0.75rem 0px 0px;
    padding: 8px;
    min-width: 48px;
    display: flex;
    position: relative;
    -webkit-box-align: baseline;
    align-items: baseline;
    word-break: break-word;
    background-color: var(--ds-background-accent-blue-subtlest, #DEEBFF);
    color: inherit;
}
.panel-icon {
    flex-shrink: 0;
    height: 24px;
    width: 24px;
    box-sizing: content-box;
    padding-right: 8px;
    text-align: center;
    user-select: none;
    color: var(--ds-icon-information, #0052CC);
}
.panel-content {
    margin: 1px 0px;
    flex: 1 0 0px;
    min-width: 0px;
}

h3 {
    font-size: 1.142em;
    line-height: 1.5;
    margin-top: 2em;
}
</style>
