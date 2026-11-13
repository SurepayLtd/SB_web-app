import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface CrbIndividual {
  individual_id: number;
  surname: string;
  forename1: string;
  forename2?: string;
  forename3?: string;
  gender: string;
  marital_status: string;
  date_of_birth: string;
  nationality: string;
  image?: string;
}

interface CrbNonIndividual {
  non_individual_id: number;
  business_name: string;
  trading_name: string;
  business_type?: string;
  industry?: string;
  date_registered: string;
  activity_description: string;
}

interface CrbSector {
  matches: number;
  sector?: string;
  individuals?: CrbIndividual[];
  nonindividuals?: CrbNonIndividual[];
}

interface KycEnquiryResponse {
  message: string;
  status: number;
  count: number;
  enquiry: {
    id: string;
    entity: string;
    timestamp: string;
    reference: string;
    criteria: string;
    search_value: string;
    identification_type: string;
    status: string;
    cost: number;
    vat: number;
    charge: number;
    formal?: CrbSector | null;
    informal?: CrbSector | null;
  };
}

interface KycEnquiryAttempt {
  id: number;
  clientName: string;
  clientAccount: string;
  validationType: any;
  requestType: any;
  status: any;
  consentStatus: any;
  providerReference: string;
  cost: number;
  responsePayload: string;
  responseDetails?: any;
  createdAt: any;
  completedAt: any;

  parsedResponse?: KycEnquiryResponse | null;
  parseError?: boolean;
}

@Component({
  selector: 'mifosx-kyc-enquiry-tab',
  templateUrl: './kyc-enquiry-tab.component.html',
  styleUrls: ['./kyc-enquiry-tab.component.scss']
})
export class KycEnquiryTabComponent implements OnInit {

  kycEnquiryChecks: KycEnquiryAttempt[] = [];


  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { kycEnquiryData: KycEnquiryAttempt[] }) => {
      this.kycEnquiryChecks = this.parseKycEnquiryChecks(data.kycEnquiryData || []);
    });
  }

  ngOnInit(): void {
  }

  private parseKycEnquiryChecks(kycEnquiryData: KycEnquiryAttempt[]): KycEnquiryAttempt[] {
    return kycEnquiryData.map((check: KycEnquiryAttempt) => this.parseKycEnquiryCheck(check));
  }

  private parseKycEnquiryCheck(check: KycEnquiryAttempt): KycEnquiryAttempt {
    try {
      return {
        ...check, parsedResponse: check.responsePayload ? JSON.parse(check.responsePayload) : null,
        parseError: false
      };
    } catch (error) {
      return {
        ...check, parsedResponse: null, parseError: true
      };
    }
  }

  getSectors(response: KycEnquiryResponse): { name: string; data: CrbSector }[] {
    if (!response?.enquiry) {
      return [];
    }

    const sectors: { name: string; data: CrbSector }[] = [];

    if (response.enquiry.formal) {
      sectors.push({
        name: 'Formal Sector',
        data: response.enquiry.formal
      });
    }

    if (response.enquiry.informal) {
      sectors.push({
        name: 'Informal Sector',
        data: response.enquiry.informal
      });
    }

    return sectors;
  }

  getFullName(person: CrbIndividual): string {
    return [person.surname, person.forename1, person.forename2, person.forename3]
      .filter(name => !!name)
      .join(' ');
  }

}
