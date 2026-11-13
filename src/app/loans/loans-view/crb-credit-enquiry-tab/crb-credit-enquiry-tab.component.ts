import { Component, OnInit } from '@angular/core';
import { CrbIndividualData, CrbSectorData, CreditEnquiryCheck, CreditEnquiryResponse } from '../../models/loan-account.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mifosx-crb-credit-enquiry-tab',
  templateUrl: './crb-credit-enquiry-tab.component.html',
  styleUrls: ['./crb-credit-enquiry-tab.component.scss']
})
export class CrbCreditEnquiryTabComponent implements OnInit {

  creditEnquiryChecks: CreditEnquiryCheck[] = [];

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { creditEnquiryData: CreditEnquiryCheck[] }) => {
      this.creditEnquiryChecks = this.parseCreditEnquiryChecks(data.creditEnquiryData || []);
    });
  }

  ngOnInit(): void {}

  private parseCreditEnquiryChecks(creditEnquiryData: CreditEnquiryCheck[]): CreditEnquiryCheck[] {
    return creditEnquiryData.map((check: CreditEnquiryCheck) => this.parseCreditEnquiryCheck(check));
  }

  private parseCreditEnquiryCheck(check: CreditEnquiryCheck): CreditEnquiryCheck {
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

  getSectors(response: CreditEnquiryResponse): { name: string; data: CrbSectorData; }[] {
    if (!response?.enquiry) {
      return [];
    }

    const sectors: { name: string; data: CrbSectorData; }[] = [];

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

  getIndividualFullName(person: CrbIndividualData): string {
    return [person.surname, person.forename1, person.forename2, person.forename3].filter(Boolean).join(' ');
  }

}
