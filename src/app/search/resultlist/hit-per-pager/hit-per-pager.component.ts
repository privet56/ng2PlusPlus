import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hit-per-pager',
  templateUrl: './hit-per-pager.component.html',
  styleUrls: ['./hit-per-pager.component.css']
})
export class HitPerPagerComponent implements OnInit
{
  public hitPerPage:number=10;

  constructor()
  {

  }

  ngOnInit()
  {

  }
}
