def get_suggestion_approved_template(name, suggestions_text):
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Suggestion Approved</title>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9; }}
            .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; }}
            .footer {{ text-align: center; font-size: 12px; color: #777; margin-top: 20px; }}
            .suggestion-box {{ background-color: #f1f1f1; padding: 15px; border-left: 5px solid #4CAF50; margin: 15px 0; font-style: italic; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Great News!</h1>
            </div>
            <div class="content">
                <p>Hello <strong>{name}</strong>,</p>
                <p>We are excited to inform you that your suggestion has been <strong>Approved</strong> by our team!</p>
                <p>Your valuable input helps us improve the platform for everyone. We will begin working on implementing your suggestion as soon as possible.</p>
                <div class="suggestion-box">
                    {suggestions_text}
                </div>
                <p>Thank you for being an active part of our community!</p>
                <p>Best Regards,<br><strong>Team Unavoidable</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Unavoidable. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

def get_suggestion_rejected_template(name, suggestions_text, reason):
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Update on Your Suggestion</title>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9; }}
            .header {{ background-color: #F44336; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; }}
            .footer {{ text-align: center; font-size: 12px; color: #777; margin-top: 20px; }}
            .suggestion-box {{ background-color: #f1f1f1; padding: 15px; border-left: 5px solid #F44336; margin: 15px 0; font-style: italic; }}
            .reason-box {{ background-color: #fff9c4; padding: 10px; border: 1px solid #fbc02d; margin-top: 10px; border-radius: 4px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Suggestion Update</h1>
            </div>
            <div class="content">
                <p>Hello <strong>{name}</strong>,</p>
                <p>Thank you for submitting your suggestion. After careful review, we regret to inform you that your suggestion has been <strong>Rejected</strong> at this time.</p>
                <div class="suggestion-box">
                    {suggestions_text}
                </div>
                <div class="reason-box">
                    <strong>Reason for rejection:</strong><br>
                    {reason}
                </div>
                <p>We appreciate your effort and encourage you to continue sharing your ideas with us in the future.</p>
                <p>Best Regards,<br><strong>Team Unavoidable</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Unavoidable. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

def get_password_reset_template(reset_link):
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9; }}
            .header {{ background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; text-align: center; }}
            .footer {{ text-align: center; font-size: 12px; color: #777; margin-top: 20px; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }}
            .link-alt {{ font-size: 11px; color: #999; margin-top: 20px; overflow-wrap: break-word; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset</h1>
            </div>
            <div class="content">
                <p>You recently requested to reset your password for your <strong>Unavoidable</strong> account.</p>
                <p>Click the button below to reset it. This link is valid for **30 minutes**.</p>
                <a href="{reset_link}" class="button">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                <div class="link-alt">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    {reset_link}
                </div>
                <p>Best Regards,<br><strong>Team Unavoidable</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Unavoidable. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
