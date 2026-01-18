"""
Test script for ML Category Verification Service
"""

import requests
import json

API_URL = "http://localhost:8000"


def test_health():
    """Test health endpoint"""
    print("\n" + "="*60)
    print("Testing Health Check")
    print("="*60)

    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    return response.status_code == 200


def test_verification_example():
    """Test verification with example data"""
    print("\n" + "="*60)
    print("Testing Category Verification")
    print("="*60)

    # Example request with test categories
    test_request = {
        "campaignId": "test_campaign_123",
        "fileUrl": "img/screenshot.jpg",
        "categories": ["food", "coffee", "drink"]
    }

    print(f"\nRequest:")
    print(f"  Campaign ID: {test_request['campaignId']}")
    print(f"  Categories: {test_request['categories']}")
    print(f"  File URL: {test_request['fileUrl']}")

    try:
        response = requests.post(
            f"{API_URL}/verify",
            json=test_request,
            timeout=60
        )

        print(f"\nResponse Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()

            print(f"\n{'='*60}")
            print("VERIFICATION RESULT")
            print(f"{'='*60}")
            print(f"PASSED: {result['passed']}")
            print(f"Confidence: {result['confidence']:.2%}")
            print(f"\nMatched Categories: {result['matched_categories']}")
            print(f"Missing Categories: {result['missing_categories']}")
            print(f"\nExplanation:")
            print(f"   {result['explanation']}")

            print(f"\n{'='*60}")
            print("EXTRACTED TEXT (OCR)")
            print(f"{'='*60}")
            print(f"Word Count: {len(result['ocr_words'])}")
            print(f"Words: {', '.join(result['ocr_words'][:20])}...")
            print(f"\nFull Text (first 200 chars):")
            print(f"{result['ocr_text'][:200]}...")

            if result.get('details'):
                print(f"\n{'='*60}")
                print("DETAILS")
                print(f"{'='*60}")
                print(f"OCR Confidence: {result['details'].get('ocr_confidence', 0):.2%}")
                print(f"Total Words: {result['details'].get('word_count', 0)}")

            return result['passed']

        else:
            print(f"\nError: {response.text}")
            return False

    except requests.exceptions.ConnectionError:
        print("\nERROR: Could not connect to service")
        print("Is the service running? Start it with: python main.py")
        return False
    except Exception as e:
        print(f"\nERROR: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*80)
    print("ML CATEGORY VERIFICATION SERVICE - TEST SUITE")
    print("="*80)

    # Test 1: Health check
    health_ok = test_health()

    if not health_ok:
        print("\nHealth check failed. Is the service running?")
        print("Start with: python main.py")
        return

    # Test 2: Example verification
    test1_ok = test_verification_example()

    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Health Check: {'PASS' if health_ok else 'FAIL'}")
    print(f"Example Test: {'PASS' if test1_ok else 'CHECK RESULTS'}")
    print("="*80)

    print("\nTIP: To test with your own image, send a POST request:")
    print(f"""
    curl -X POST {API_URL}/verify \\
      -H "Content-Type: application/json" \\
      -d '{{
        "campaignId": "test123",
        "fileUrl": "YOUR_IMAGE_URL_OR_PATH",
        "categories": ["category1", "category2"]
      }}'
    """)


if __name__ == "__main__":
    main()
