const TermsAndConditions = () => {
    return (
        <div className="mt-8">
            
            <p className="mb-4">
                Welcome to our Terms and Conditions page. These terms outline the rules and regulations for the use of the <strong>Community Management System</strong> (referred to as "the platform" or "the service").
            </p>

            <br></br>

            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p className="mb-4">
                By accessing this website and platform, we assume you accept these terms and conditions. If you do not agree with all the terms and conditions stated on this page, do not continue to use the service.
            </p>

            <h2 className="text-xl font-semibold mb-2">2. User Registration and Account</h2>
            <p className="mb-4">
                Users must register with a valid email and password to access certain features of the platform. During registration, users may be required to provide optional details like age, gender, country, and a short bio. All personal information will be processed in compliance with GDPR regulations.
            </p>

            <h2 className="text-xl font-semibold mb-2">3. Content Creation and Management</h2>
            <p className="mb-4">
                Registered users can create, edit, and manage content such as posts, comments, and media within communities. Users are responsible for ensuring that their content complies with community rules. Community moderators may remove inappropriate content.
            </p>

            <h2 className="text-xl font-semibold mb-2">4. Community Rules and Moderation</h2>
            <p className="mb-4">
                Community creators can establish specific rules for their communities, and they may delegate moderation roles to other users. Both creators and moderators are responsible for maintaining the integrity of the community by actively monitoring content and enforcing community guidelines.
            </p>

            <h2 className="text-xl font-semibold mb-2">5. Privacy and Data Protection</h2>
            <p className="mb-4">
                The platform is committed to protecting user privacy. User data will be stored securely and in compliance with data protection laws, including GDPR. Users can access, modify, and request deletion of their data at any time. More details are provided in our <a href="/privacy-policy" className="text-blue-600">Privacy Policy</a>.
            </p>

            <h2 className="text-xl font-semibold mb-2">6. Restrictions on Use</h2>
            <p className="mb-4">
                Users are not allowed to:
                <ul className="list-disc list-inside ml-4">
                    <li>Post content that violates community guidelines or local laws.</li>
                    <li>Share offensive, harmful, or misleading content.</li>
                    <li>Access or attempt to access restricted areas without permission.</li>
                </ul>
            </p>

            <h2 className="text-xl font-semibold mb-2">7. Intellectual Property</h2>
            <p className="mb-4">
                All content created on the platform remains the intellectual property of its creators. However, by posting content, users grant the platform a non-exclusive license to display, modify, and distribute the content within the platform’s communities.
            </p>

            <h2 className="text-xl font-semibold mb-2">8. Abuse Reporting</h2>
            <p className="mb-4">
                Users can report inappropriate content or behavior via the abuse reporting tools available on posts, comments, and messages. The platform will notify moderators for appropriate action.
            </p>

            <h2 className="text-xl font-semibold mb-2">9. Termination of Accounts</h2>
            <p className="mb-4">
                The platform reserves the right to terminate or suspend user accounts if they violate these terms or community rules.
            </p>

            <h2 className="text-xl font-semibold mb-2">10. Changes to the Terms and Conditions</h2>
            <p className="mb-4">
                We reserve the right to update or modify these terms at any time. Changes will be effective immediately upon posting to this page. Users are encouraged to review these terms regularly.
            </p>

            <h2 className="text-xl font-semibold mb-2">11. Governing Law</h2>
            <p className="mb-4">
                These terms and conditions are governed by and construed in accordance with the local laws, and you irrevocably submit to the exclusive jurisdiction of the courts in your location.
            </p>

            <p className="mb-4">
                If you have any questions or concerns about these terms, please contact us at support@communitymanagement.com.
            </p>
        </div>
    );
};

export default TermsAndConditions;