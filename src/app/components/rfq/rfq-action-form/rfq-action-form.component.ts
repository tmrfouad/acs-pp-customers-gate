import 'rxjs/add/operator/switchMap';

import { Component, Input } from '@angular/core';
import { isNumber } from 'util';
import { ActionType } from './../../../models/ActionType';
import { RFQ } from './../../../models/RFQ';
import { RFQAction } from './../../../models/RFQAction';
import { RfqService } from './../../../services/rfq.service';
import { NetworkService } from '../../../services/network.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { RfqEditFormComponent } from '../rfq-edit-form/rfq-edit-form.component';
import { StatusEditFormComponent } from '../status-edit-form/status-edit-form.component';
import { StatusService } from '../../../services/status.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rfq-action-form',
  templateUrl: './rfq-action-form.component.html',
  styleUrls: ['./rfq-action-form.component.css']
})
export class RfqActionFormComponent {
  private _rfqStatus: RFQAction;
  actionType_Names: string[];
  actionType_Values: string[];
  actionTypeNames: string[];
  actionTypeValues: string[];
  statusListHidden = true;
  reloadActions = false;
  statusesMap: { [key: string]: string } = {};

  @Input('rfq') rfq: RFQ;
  get rfqStatus(): RFQAction {
    return this._rfqStatus;
  }
  @Input('rfqStatus') set rfqStatus(status: RFQAction) {
    this._rfqStatus = status;
  }

  constructor(
    private rfqService: RfqService,
    private dialog: MatDialog,
    private statusService: StatusService) {

    const types = Object.keys(ActionType);
    this.actionType_Names = types.slice(types.length / 2);
    this.actionType_Values = types.slice(0, types.length / 2);
    this.actionTypeNames = types.slice(types.length / 2).filter(a => a !== 'None');
    this.actionTypeValues = types.slice(0, types.length / 2).filter(a => a !== '0');

    this.statusesMap = this.statusService.getMapByValue();
  }

  // dialogRef: MatDialogRef<TestComponent>;
  addAction(actionTypeName: string) {
    const actionType: ActionType = ActionType[actionTypeName];
    const action: RFQAction = {
      actionType: actionType
    };
    const StatusDialogRef = this.dialog.open(StatusEditFormComponent, {
      width: '800px',
      height: '530px',
      position: { top: '100px' },
      data: 'new'
    });
    this.reloadActions = false;
    StatusDialogRef.componentInstance.actualAction = this.rfqStatus;
    StatusDialogRef.componentInstance.action = action;
    StatusDialogRef.componentInstance.rfqOptions = {
      rfqId: this.rfq.rfqId,
      addStatus: true
    };

    StatusDialogRef.afterClosed()
      .subscribe(() => {
        if (StatusDialogRef.componentInstance.dialogResult === 'save') {
          this.reloadActions = true;
          this.rfqStatus = StatusDialogRef.componentInstance.action;
        }
      });
  }

  toggleStatusList() {
    this.statusListHidden = !this.statusListHidden;
  }

  openRfqEditDialog() {
    const rfqDialogRef = this.dialog.open(RfqEditFormComponent, {
      width: '800px',
      height: '530px',
      position: { top: '100px' },
      data: 'edit'
    });
    rfqDialogRef.componentInstance.rfqParameterItem = this.rfq;
  }

  openStatusEditDialog(action: RFQAction) {
    const StatusDialogRef = this.dialog.open(StatusEditFormComponent, {
      width: '800px',
      height: '530px',
      position: { top: '100px' },
      data: 'edit'
    });
    StatusDialogRef.componentInstance.action = action;
    StatusDialogRef.afterClosed().subscribe();
  }
}
